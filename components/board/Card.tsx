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
      <div className={`rounded-xl p-3 bg-white transition-all ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}`}
        style={{ border: '1px solid rgba(99,102,241,0.1)', borderLeft: '3px solid #c7d2fe', boxShadow: '0 1px 4px rgba(99,102,241,0.06)' }}>
        <div className="h-2.5 bg-indigo-100 rounded animate-pulse mb-2 w-3/4" />
        <div className="h-2.5 bg-indigo-100 rounded animate-pulse w-1/2" />
        <p className="text-xs text-gray-400 mt-2 italic">Hidden until reveal</p>
      </div>
    );
  }

  if (editing && canEdit) {
    return (
      <div className="rounded-xl p-3 bg-white" style={{ border: '1.5px solid #6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.12)' }}>
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
      className={`rounded-xl p-3 bg-white transition-all cursor-default group ${
        isHighlighted
          ? 'scale-[1.02] ring-2 ring-yellow-400'
          : 'hover:-translate-y-0.5'
      }`}
      style={{
        border: '1px solid rgba(99,102,241,0.1)',
        borderLeft: '3px solid #a5b4fc',
        boxShadow: isHighlighted
          ? '0 8px 24px rgba(99,102,241,0.18)'
          : '0 1px 4px rgba(99,102,241,0.06), 0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <p className="text-[13.5px] text-gray-800 whitespace-pre-wrap break-words leading-relaxed">{card.content}</p>

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
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-500"
              style={{ background: '#eef2ff', borderRadius: '20px', padding: '2px 8px' }}>
              👍 {card.voteCount}
            </span>
          )}
          {canEdit && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-gray-300 hover:text-gray-500 p-1 rounded transition-colors"
              title="Edit card"
            >
              ✏️
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete!(card.id)}
              className="text-xs text-gray-300 hover:text-red-400 p-1 rounded transition-colors"
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
