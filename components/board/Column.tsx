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
    <div className={`flex flex-col rounded-xl border-2 ${column.border} overflow-hidden min-w-0`}>
      <div className={`${column.header} text-white px-4 py-3 flex items-center justify-between`}>
        <span className="font-semibold">
          {column.emoji} {column.label}
        </span>
        <span className="bg-white bg-opacity-30 text-white text-xs px-2 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>

      <div className={`${column.color} flex-1 p-3 space-y-2 overflow-y-auto`} style={{ minHeight: '200px', maxHeight: '60vh' }}>
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
            <div className="bg-white rounded-lg border border-indigo-200 p-2">
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
              className="w-full text-sm text-gray-400 hover:text-indigo-600 hover:bg-white border-2 border-dashed border-gray-300 hover:border-indigo-300 rounded-lg py-3 transition-colors"
            >
              + Add card
            </button>
          )
        )}
      </div>
    </div>
  );
}
