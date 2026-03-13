import { NextRequest, NextResponse } from 'next/server';
import { getSession, getCardsBySession, getVotesBySession } from '@/lib/db-queries';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = getSession(params.sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const participantId = req.nextUrl.searchParams.get('participantId') || '';
  const cards = getCardsBySession(params.sessionId);
  const votes = getVotesBySession(params.sessionId);

  const result = cards.map((card: any) => {
    const isOwn = card.author_id === participantId;
    const shouldMask = card.is_hidden === 1 && !isOwn;
    const cardVotes = votes.filter((v: any) => v.card_id === card.id);
    return {
      id: card.id,
      columnId: card.column_id,
      authorId: card.author_id,
      authorName: card.author_name,
      content: shouldMask ? '' : card.content,
      isHidden: card.is_hidden === 1,
      isOwn,
      voteCount: cardVotes.length,
      hasVoted: cardVotes.some((v: any) => v.voter_id === participantId),
      position: card.position,
      createdAt: card.created_at,
    };
  });

  return NextResponse.json(result);
}
