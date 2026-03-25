'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

interface VoteButtonProps {
  count: number;
  hasVoted: boolean;
  votesRemaining: number;
  onVote: () => void;
  onUnvote: () => void;
}

export function VoteButton({ count, hasVoted, votesRemaining, onVote, onUnvote }: VoteButtonProps) {
  const { t } = useLanguage();
  const canVote = !hasVoted && votesRemaining > 0;

  const titleText = hasVoted ? t('board.removeVote') : votesRemaining === 0 ? t('board.noVotesLeft') : t('board.voteForCard');

  return (
    <button
      onClick={hasVoted ? onUnvote : onVote}
      disabled={!canVote && !hasVoted}
      title={titleText}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold transition-all hover:-translate-y-px"
      style={
        hasVoted
          ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }
          : canVote
          ? { background: 'var(--surface-solid)', color: 'var(--text-muted)', border: '1.5px solid var(--border-input)' }
          : { background: 'var(--surface-dim)', color: 'var(--text-subtle)', border: '1.5px solid var(--border)', cursor: 'not-allowed' }
      }
    >
      <span>▲</span>
      <span>{count}</span>
    </button>
  );
}
