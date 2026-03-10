'use client';

import { useState } from 'react';
import { VoteButton } from './VoteButton';
import { CardForm } from './CardForm';

export interface CardData {
  id: string;
  columnId: string;
  authorId: string;
  authorName: string;
  content: string;
  isHidden: boolean;
  isOwn: boolean;
  voteCount: number;
  hasVoted: boolean;
  position: number;
  createdAt: number;
}

interface CardProps {
  card: CardData;
  phase: string;
  isHighlighted: boolean;
  votesRemaining: number;
  onEdit?: (cardId: string, content: string) => void;
  onDelete?: (cardId: string) => void;
  onVote?: (cardId: string) => void;
  onUnvote?: (cardId: string) => void;
}

export function Card({
  card,
  phase,
  isHighlighted,
  votesRemaining,
  onEdit,
  onDelete,
  onVote,
  onUnvote,
}: CardProps) {
  const [editing, setEditing] = useState(false);

  const canEdit = card.isOwn && phase === 'write' && onEdit;
  const canDelete = card.isOwn && phase === 'write' && onDelete;
  const showVote = phase === 'vote' && onVote && onUnvote;

  if (card.isHidden && !card.isOwn) {
    return (
      <div className={`rounded-lg p-3 border border-gray-200 ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}`}>
        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <p className="text-xs text-gray-400 mt-2 italic">Hidden until reveal</p>
      </div>
    );
  }

  if (editing && canEdit) {
    return (
      <div className="rounded-lg p-3 border-2 border-indigo-300 bg-white">
        <CardForm
          initialValue={card.content}
          onSubmit={(content) => {
            onEdit!(card.id, content);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
          submitLabel="Save"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-3 bg-white border shadow-sm transition-all ${
        isHighlighted ? 'ring-2 ring-yellow-400 scale-105 shadow-lg' : 'border-gray-200'
      }`}
    >
      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{card.content}</p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">{card.authorName}</span>

        <div className="flex items-center gap-1">
          {showVote && (
            <VoteButton
              count={card.voteCount}
              hasVoted={card.hasVoted}
              votesRemaining={votesRemaining}
              onVote={() => onVote!(card.id)}
              onUnvote={() => onUnvote!(card.id)}
            />
          )}
          {phase === 'discuss' && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              👍 <span className="font-semibold">{card.voteCount}</span>
            </span>
          )}
          {canEdit && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-gray-400 hover:text-gray-600 p-1"
              title="Edit card"
            >
              ✏️
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete!(card.id)}
              className="text-xs text-gray-400 hover:text-red-500 p-1"
              title="Delete card"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
