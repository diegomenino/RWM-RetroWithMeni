'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import Link from 'next/link';

interface CardData {
  id: string;
  columnId: string;
  authorName: string;
  content: string;
  isHidden: boolean;
  voteCount: number;
}

interface SessionData {
  id: string;
  name: string;
  format: string;
  phase: string;
}

interface ColumnDef {
  id: string;
  label: string;
  emoji: string;
  color: string;
  border: string;
  header: string;
}

export default function SessionViewPage() {
  const { t } = useLanguage();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSession(data.session);
        setColumns(data.columns);
        setCards(data.cards || []);
      } catch {
        console.error('Failed to load session');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionId]);

  if (loading || !session) {
    return <main className="min-h-screen flex items-center justify-center">{t('common.loading')}</main>;
  }

  const phaseLabel: Record<string, string> = {
    write: t('phase.write'),
    vote: t('phase.vote'),
    discuss: t('phase.discuss'),
    done: t('phase.done'),
  };

  return (
    <main className="min-h-screen p-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-sm text-indigo-500 hover:underline mb-1 block">← {t('view.back')}</Link>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{session.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('view.id')}: <span className="font-mono">{session.id}</span>
              {' · '}{t('view.phase')}: <span className="font-medium">{phaseLabel[session.phase] ?? session.phase}</span>
              {' · '}{t('view.readOnly')}
            </p>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((col: ColumnDef) => {
            const colCards = cards
              .filter(c => c.columnId === col.id && !c.isHidden)
              .sort((a, b) => b.voteCount - a.voteCount);

            return (
              <div key={col.id} className={`rounded-xl border-2 ${col.border} overflow-hidden`}>
                <div className={`${col.header} px-4 py-2 flex items-center justify-between`}>
                  <span className="font-semibold text-white text-sm">
                    {col.emoji} {col.label}
                  </span>
                  <span className="text-white/80 text-xs">{colCards.length} {colCards.length !== 1 ? t('view.cards') : t('view.card')}</span>
                </div>

                <div className={`${col.color} p-3 space-y-2 min-h-[120px]`}>
                  {colCards.length === 0 && (
                    <p className="text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>{t('view.noCards')}</p>
                  )}
                  {colCards.map(card => (
                    <div key={card.id} className="rounded-lg p-3 shadow-sm" style={{ background: 'var(--surface-solid)', border: '1px solid var(--border)' }}>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text)' }}>{card.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.authorName}</span>
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
          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            {t('view.inProgress')}
          </p>
        )}
      </div>
    </main>
  );
}
