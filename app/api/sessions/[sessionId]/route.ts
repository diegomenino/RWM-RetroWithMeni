import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession, validateFacilitator, getCardsBySession, getVotesBySession } from '@/lib/db-queries';
import { getColumns } from '@/lib/retro-formats';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const columns = getColumns(session.format);
  const rawCards = getCardsBySession(sessionId) as any[];
  const votes = getVotesBySession(sessionId) as any[];

  const cards = rawCards.map(card => ({
    id: card.id,
    columnId: card.column_id,
    authorName: card.author_name,
    content: card.content,
    isHidden: card.is_hidden === 1,
    voteCount: votes.filter((v: any) => v.card_id === card.id).length,
  }));

  return NextResponse.json({
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
    cards,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const token = req.headers.get('x-facilitator-token');
  if (!token || !validateFacilitator(sessionId, token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.phase !== undefined) updates.phase = body.phase;
  if (body.maxVotes !== undefined) updates.maxVotes = body.maxVotes;
  if (body.timerEndsAt !== undefined) updates.timerEndsAt = body.timerEndsAt;

  const updated = updateSession(sessionId, updates);
  return NextResponse.json({ id: updated.id, phase: updated.phase });
}
