'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Card, CardData } from './Card';
import { CardForm } from './CardForm';

interface ColumnDefinition {
  id: string;
  label: string;
  emoji: string;
  color: string;
  border: string;
  header: string;
}

interface ColumnProps {
  column: ColumnDefinition;
  cards: CardData[];
  phase: string;
  votesRemaining: number;
  highlightedCardId: string | null;
  onAddCard: (columnId: string, content: string) => void;
  onEditCard: (cardId: string, content: string) => void;
  onDeleteCard: (cardId: string) => void;
  onVote: (cardId: string) => void;
  onUnvote: (cardId: string) => void;
}

export function Column({
  column,
  cards,
  phase,
  votesRemaining,
  highlightedCardId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onVote,
  onUnvote,
}: ColumnProps) {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  // Sort by votes desc during discuss phase
  const sortedCards = phase === 'discuss'
    ? [...cards].sort((a, b) => b.voteCount - a.voteCount)
    : cards;

  return (
    <div className="flex flex-col overflow-hidden min-w-0"
      style={{ borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--panel-shadow)', background: 'var(--surface-solid)' }}>
      <div className={`${column.header} px-4 py-3 flex items-center justify-between`}>
        <span className="font-bold text-[13px] text-white tracking-[0.05px]">
          {column.emoji} {column.label}
        </span>
        <span className="bg-white/30 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto" style={{ minHeight: '200px', maxHeight: '60vh', background: 'var(--surface-col)' }}>
        {sortedCards.map(card => (
          <Card
            key={card.id}
            card={card}
            phase={phase}
            isHighlighted={card.id === highlightedCardId}
            votesRemaining={votesRemaining}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onVote={onVote}
            onUnvote={onUnvote}
          />
        ))}

        {phase === 'write' && (
          showForm ? (
            <div className="rounded-xl p-2" style={{ background: 'var(--surface-solid)', border: '1.5px solid var(--border-input)' }}>
              <CardForm
                onSubmit={(content) => {
                  onAddCard(column.id, content);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
                placeholder={t('board.addTo', { column: column.label })}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-[13px] font-medium text-gray-400 hover:text-indigo-500 border-2 border-dashed border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl py-3 transition-all"
            >
              + {t('board.addCard')}
            </button>
          )
        )}
      </div>
    </div>
  );
}
