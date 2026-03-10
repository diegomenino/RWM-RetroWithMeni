'use client';

interface VoteButtonProps {
  count: number;
  hasVoted: boolean;
  votesRemaining: number;
  onVote: () => void;
  onUnvote: () => void;
}

export function VoteButton({ count, hasVoted, votesRemaining, onVote, onUnvote }: VoteButtonProps) {
  const canVote = !hasVoted && votesRemaining > 0;

  return (
    <button
      onClick={hasVoted ? onUnvote : onVote}
      disabled={!canVote && !hasVoted}
      title={hasVoted ? 'Remove vote' : votesRemaining === 0 ? 'No votes remaining' : 'Vote for this card'}
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
        hasVoted
          ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
          : canVote
          ? 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
          : 'bg-white text-gray-400 border-gray-200 cursor-not-allowed'
      }`}
    >
      <span>👍</span>
      <span className="font-medium">{count}</span>
    </button>
  );
}
