import { notFound } from 'next/navigation';
import { getSession } from '@/lib/db-queries';
import { getColumns } from '@/lib/retro-formats';
import { getCardsBySession, getVotesBySession } from '@/lib/db-queries';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionViewPage({ params }: PageProps) {
  const { sessionId } = await params;
  const session = getSession(sessionId);
  if (!session) notFound();

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

  const phaseLabel: Record<string, string> = {
    write: 'Write',
    vote: 'Vote',
    discuss: 'Discuss',
    done: 'Done',
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-sm text-indigo-500 hover:underline mb-1 block">← Home</Link>
            <h1 className="text-2xl font-bold text-gray-800">{session.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              ID: <span className="font-mono">{session.id}</span>
              {' · '}Phase: <span className="font-medium">{phaseLabel[session.phase] ?? session.phase}</span>
              {' · '}Read-only view
            </p>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((col: any) => {
            const colCards = cards
              .filter(c => c.columnId === col.id && !c.isHidden)
              .sort((a, b) => b.voteCount - a.voteCount);

            return (
              <div key={col.id} className={`rounded-xl border-2 ${col.border} overflow-hidden`}>
                <div className={`${col.header} px-4 py-2 flex items-center justify-between`}>
                  <span className="font-semibold text-white text-sm">
                    {col.emoji} {col.label}
                  </span>
                  <span className="text-white/80 text-xs">{colCards.length} card{colCards.length !== 1 ? 's' : ''}</span>
                </div>

                <div className={`${col.color} p-3 space-y-2 min-h-[120px]`}>
                  {colCards.length === 0 && (
                    <p className="text-xs text-gray-400 text-center pt-4">No cards</p>
                  )}
                  {colCards.map(card => (
                    <div key={card.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{card.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{card.authorName}</span>
                        {card.voteCount > 0 && (
                          <span className="text-xs bg-indigo-100 text-indigo-600 font-medium px-2 py-0.5 rounded-full">
                            👍 {card.voteCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {session.phase !== 'done' && (
          <p className="text-center text-xs text-gray-400 mt-6">
            This session is still in progress. Hidden cards are not shown.
          </p>
        )}
      </div>
    </main>
  );
}
