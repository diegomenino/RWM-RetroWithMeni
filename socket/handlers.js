const {
  getSession, updateSession, validateFacilitator,
  createCard, getCard, getCardsBySession, updateCard, deleteCard, revealAllCards, clearCards,
  castVote, removeVote, getVoteCount, getVoterIdsForCard, getVotesBySession, getVoterVoteCount,
} = require('../lib/db-queries');
const { getColumns, isValidColumnId } = require('../lib/retro-formats');

// In-memory participant registry per session room
// { sessionId: { participantId: { participantId, displayName, isFacilitator, joinedAt, socketId } } }
const rooms = {};

function getRoomParticipants(sessionId) {
  return Object.values(rooms[sessionId] || {});
}

function buildCardView(card, viewerParticipantId, sessionPhase, votes) {
  const isOwn = card.author_id === viewerParticipantId;
  const isHidden = card.is_hidden === 1;
  const shouldMaskContent = isHidden && !isOwn;

  const cardVotes = votes.filter(v => v.card_id === card.id);
  const voteCount = cardVotes.length;
  const hasVoted = cardVotes.some(v => v.voter_id === viewerParticipantId);

  return {
    id: card.id,
    columnId: card.column_id,
    authorId: card.author_id,
    authorName: card.author_name,
    content: shouldMaskContent ? '' : card.content,
    isHidden: isHidden,
    isOwn,
    voteCount,
    hasVoted,
    position: card.position,
    createdAt: card.created_at,
  };
}

function buildSessionState(session, viewerParticipantId, sessionId) {
  const cards = getCardsBySession(sessionId);
  const votes = getVotesBySession(sessionId);
  const columns = getColumns(session.format);
  const participants = getRoomParticipants(sessionId);

  const myVotesCast = votes.filter(v => v.voter_id === viewerParticipantId).length;
  const myVotesRemaining = Math.max(0, session.max_votes - myVotesCast);

  return {
    session: {
      id: session.id,
      name: session.name,
      format: session.format,
      phase: session.phase,
      maxVotes: session.max_votes,
      timerEndsAt: session.timer_ends_at,
      createdAt: session.created_at,
    },
    columns,
    cards: cards.map(c => buildCardView(c, viewerParticipantId, session.phase, votes)),
    participants,
    myVotesRemaining,
  };
}

function registerHandlers(io) {
  io.on('connection', (socket) => {

    // ── join_session ────────────────────────────────────────────────────────────
    socket.on('join_session', ({ sessionId, participantId, displayName, facilitatorToken }) => {
      const session = getSession(sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const isFacilitator = !!facilitatorToken && validateFacilitator(sessionId, facilitatorToken);

      if (!rooms[sessionId]) rooms[sessionId] = {};

      // Remove old socket entry for same participantId if reconnecting
      const existing = rooms[sessionId][participantId];
      if (existing && existing.socketId !== socket.id) {
        // old socket might still be in room — that's fine, it'll be cleaned on disconnect
      }

      rooms[sessionId][participantId] = {
        participantId,
        displayName: displayName || `Participant ${Object.keys(rooms[sessionId]).length + 1}`,
        isFacilitator,
        joinedAt: Date.now(),
        socketId: socket.id,
      };

      socket.participantId = participantId;
      socket.sessionId = sessionId;
      socket.join(sessionId);

      // Send full state to the joining socket
      socket.emit('session_state', buildSessionState(session, participantId, sessionId));

      // Notify others
      socket.to(sessionId).emit('participant_joined', rooms[sessionId][participantId]);
    });

    // ── card_add ────────────────────────────────────────────────────────────────
    socket.on('card_add', ({ sessionId, columnId, content }) => {
      const session = getSession(sessionId);
      if (!session || session.phase !== 'write') {
        socket.emit('error', { message: 'Cards can only be added during the write phase' });
        return;
      }
      if (!isValidColumnId(session.format, columnId)) {
        socket.emit('error', { message: 'Invalid column' });
        return;
      }
      if (!content || content.trim().length === 0) {
        socket.emit('error', { message: 'Card content cannot be empty' });
        return;
      }

      const participantId = socket.participantId;
      const participant = rooms[sessionId]?.[participantId];
      const authorName = participant?.displayName || 'Anonymous';

      const card = createCard({
        sessionId,
        columnId,
        authorId: participantId,
        authorName,
        content: content.trim(),
      });

      const votes = getVotesBySession(sessionId);

      // Broadcast to room: author sees full content, others see masked version
      io.in(sessionId).fetchSockets().then(sockets => {
        sockets.forEach(s => {
          const pid = s.participantId;
          s.emit('card_added', buildCardView(card, pid, session.phase, votes));
        });
      });
    });

    // ── card_edit ───────────────────────────────────────────────────────────────
    socket.on('card_edit', ({ sessionId, cardId, content }) => {
      const session = getSession(sessionId);
      if (!session || session.phase !== 'write') {
        socket.emit('error', { message: 'Cards can only be edited during the write phase' });
        return;
      }

      const card = getCard(cardId);
      if (!card || card.author_id !== socket.participantId) {
        socket.emit('error', { message: 'Not authorized to edit this card' });
        return;
      }
      if (!content || content.trim().length === 0) {
        socket.emit('error', { message: 'Card content cannot be empty' });
        return;
      }

      const updated = updateCard(cardId, { content: content.trim() });
      const votes = getVotesBySession(sessionId);

      io.in(sessionId).fetchSockets().then(sockets => {
        sockets.forEach(s => {
          s.emit('card_updated', buildCardView(updated, s.participantId, session.phase, votes));
        });
      });
    });

    // ── card_delete ─────────────────────────────────────────────────────────────
    socket.on('card_delete', ({ sessionId, cardId }) => {
      const session = getSession(sessionId);
      if (!session || session.phase !== 'write') {
        socket.emit('error', { message: 'Cards can only be deleted during the write phase' });
        return;
      }

      const card = getCard(cardId);
      if (!card || card.author_id !== socket.participantId) {
        socket.emit('error', { message: 'Not authorized to delete this card' });
        return;
      }

      deleteCard(cardId);
      io.to(sessionId).emit('card_deleted', { cardId });
    });

    // ── card_vote ───────────────────────────────────────────────────────────────
    socket.on('card_vote', ({ sessionId, cardId }) => {
      const session = getSession(sessionId);
      if (!session || session.phase !== 'vote') {
        socket.emit('error', { message: 'Voting is only allowed during the vote phase' });
        return;
      }

      const voterId = socket.participantId;
      const votesUsed = getVoterVoteCount(sessionId, voterId);
      if (votesUsed >= session.max_votes) {
        socket.emit('error', { message: 'No votes remaining' });
        return;
      }

      try {
        castVote({ sessionId, cardId, voterId });
      } catch (e) {
        socket.emit('error', { message: 'Already voted on this card' });
        return;
      }

      const voteCount = getVoteCount(cardId);
      const voterIds = getVoterIdsForCard(cardId);
      io.to(sessionId).emit('vote_updated', { cardId, voteCount, voterIds });

      // Update votes remaining for the voter
      const newVotesUsed = getVoterVoteCount(sessionId, voterId);
      const votesRemaining = Math.max(0, session.max_votes - newVotesUsed);
      socket.emit('votes_remaining', { votesRemaining });
    });

    // ── card_unvote ─────────────────────────────────────────────────────────────
    socket.on('card_unvote', ({ sessionId, cardId }) => {
      const session = getSession(sessionId);
      if (!session || session.phase !== 'vote') {
        socket.emit('error', { message: 'Only allowed during the vote phase' });
        return;
      }

      const voterId = socket.participantId;
      removeVote(cardId, voterId);

      const voteCount = getVoteCount(cardId);
      const voterIds = getVoterIdsForCard(cardId);
      io.to(sessionId).emit('vote_updated', { cardId, voteCount, voterIds });

      const votesUsed = getVoterVoteCount(sessionId, voterId);
      const votesRemaining = Math.max(0, session.max_votes - votesUsed);
      socket.emit('votes_remaining', { votesRemaining });
    });

    // ── phase_advance ───────────────────────────────────────────────────────────
    socket.on('phase_advance', ({ sessionId, facilitatorToken, targetPhase }) => {
      if (!validateFacilitator(sessionId, facilitatorToken)) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      const session = getSession(sessionId);
      const phaseOrder = ['write', 'vote', 'discuss', 'done'];
      const currentIdx = phaseOrder.indexOf(session.phase);
      const targetIdx = phaseOrder.indexOf(targetPhase);

      if (targetIdx !== currentIdx + 1) {
        socket.emit('error', { message: 'Invalid phase transition' });
        return;
      }

      // Reveal all cards when moving from write to vote
      if (targetPhase === 'vote') {
        revealAllCards(sessionId);
      }

      updateSession(sessionId, { phase: targetPhase });
      const updatedSession = getSession(sessionId);
      const allCards = getCardsBySession(sessionId);
      const votes = getVotesBySession(sessionId);

      // Broadcast phase change — each socket gets cards from their perspective
      io.in(sessionId).fetchSockets().then(sockets => {
        sockets.forEach(s => {
          s.emit('phase_changed', {
            phase: targetPhase,
            cards: allCards.map(c => buildCardView(c, s.participantId, targetPhase, votes)),
            session: {
              id: updatedSession.id,
              name: updatedSession.name,
              format: updatedSession.format,
              phase: updatedSession.phase,
              maxVotes: updatedSession.max_votes,
              timerEndsAt: updatedSession.timer_ends_at,
            },
          });
        });
      });
    });

    // ── cards_clear ─────────────────────────────────────────────────────────────
    socket.on('cards_clear', ({ sessionId, facilitatorToken, columnId }) => {
      if (!validateFacilitator(sessionId, facilitatorToken)) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      clearCards(sessionId, columnId || null);
      io.to(sessionId).emit('cards_cleared', { columnId: columnId || null });
    });

    // ── timer_set ───────────────────────────────────────────────────────────────
    socket.on('timer_set', ({ sessionId, facilitatorToken, durationMs }) => {
      if (!validateFacilitator(sessionId, facilitatorToken)) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      const timerEndsAt = durationMs ? Date.now() + durationMs : null;
      updateSession(sessionId, { timerEndsAt });
      io.to(sessionId).emit('timer_updated', { timerEndsAt });
    });

    // ── discuss_highlight ────────────────────────────────────────────────────────
    socket.on('discuss_highlight', ({ sessionId, facilitatorToken, cardId }) => {
      if (!validateFacilitator(sessionId, facilitatorToken)) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      io.to(sessionId).emit('card_highlighted', { cardId });
    });

    // ── rename_participant ───────────────────────────────────────────────────────
    socket.on('rename_participant', ({ sessionId, displayName }) => {
      const participantId = socket.participantId;
      if (rooms[sessionId]?.[participantId]) {
        rooms[sessionId][participantId].displayName = displayName;
        io.to(sessionId).emit('participant_renamed', { participantId, displayName });
      }
    });

    // ── disconnect ───────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const { sessionId, participantId } = socket;
      if (sessionId && participantId && rooms[sessionId]) {
        delete rooms[sessionId][participantId];
        if (Object.keys(rooms[sessionId]).length === 0) {
          delete rooms[sessionId];
        }
        io.to(sessionId).emit('participant_left', { participantId });
      }
    });
  });
}

module.exports = { registerHandlers };
