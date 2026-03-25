'use client';

import { useState } from 'react';
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
  const [showForm, setShowForm] = useState(false);

  // Sort by votes desc during discuss phase
  const sortedCards = phase === 'discuss'
    ? [...cards].sort((a, b) => b.voteCount - a.voteCount)
    : cards;

  return (
    <div className="flex flex-col overflow-hidden min-w-0"
      style={{ borderRadius: '20px', border: '1px solid rgba(99,102,241,0.12)', boxShadow: '0 2px 16px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04)', background: 'white' }}>
      <div className={`${column.header} px-4 py-3 flex items-center justify-between`}>
        <span className="font-bold text-[13px] text-white tracking-[0.05px]">
          {column.emoji} {column.label}
        </span>
        <span className="bg-white/30 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50/50" style={{ minHeight: '200px', maxHeight: '60vh' }}>
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
            <div className="bg-white rounded-xl p-2" style={{ border: '1.5px solid #e0e7ff' }}>
              <CardForm
                onSubmit={(content) => {
                  onAddCard(column.id, content);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
                placeholder={`Add to ${column.label}…`}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full text-[13px] font-medium text-gray-400 hover:text-indigo-500 border-2 border-dashed border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl py-3 transition-all"
            >
              + Add card
            </button>
          )
        )}
      </div>
    </div>
  );
}
