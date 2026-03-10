'use client';

import { useState, useEffect } from 'react';

const PHASES = ['write', 'vote', 'discuss', 'done'] as const;
type Phase = typeof PHASES[number];

const PHASE_LABELS: Record<Phase, string> = {
  write: '✍️ Write',
  vote: '🗳️ Vote',
  discuss: '💬 Discuss',
  done: '✅ Done',
};

const NEXT_PHASE_LABEL: Record<string, string> = {
  write: 'Reveal & Start Voting',
  vote: 'Start Discussion',
  discuss: 'Finish Session',
};

interface PhaseControlsProps {
  sessionId: string;
  phase: string;
  timerEndsAt: number | null;
  maxVotes: number;
  votesRemaining: number;
  isFacilitator: boolean;
  facilitatorToken: string | null;
  onPhaseAdvance: (targetPhase: string, token: string) => void;
  onTimerSet: (durationMs: number | null, token: string) => void;
  onClearCards: (token: string) => void;
  onExport: (token: string) => void;
}

export function PhaseControls({
  sessionId,
  phase,
  timerEndsAt,
  maxVotes,
  votesRemaining,
  isFacilitator,
  facilitatorToken,
  onPhaseAdvance,
  onTimerSet,
  onClearCards,
  onExport,
}: PhaseControlsProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!timerEndsAt) { setTimeLeft(null); return; }
    const update = () => {
      const remaining = timerEndsAt - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timerEndsAt]);

  const currentPhaseIdx = PHASES.indexOf(phase as Phase);
  const nextPhase = PHASES[currentPhaseIdx + 1] as Phase | undefined;

  function formatTime(ms: number) {
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Phase stepper */}
      <div className="flex items-center gap-1">
        {PHASES.filter(p => p !== 'done').map((p, i) => (
          <div key={p} className="flex items-center gap-1">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                p === phase
                  ? 'bg-indigo-600 text-white'
                  : PHASES.indexOf(p) < currentPhaseIdx
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {PHASE_LABELS[p]}
            </span>
            {i < 2 && <span className="text-gray-300 text-xs">→</span>}
          </div>
        ))}
        {phase === 'done' && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white font-medium">
            {PHASE_LABELS.done}
          </span>
        )}
      </div>

      {/* Votes remaining badge (non-facilitator) */}
      {!isFacilitator && phase === 'vote' && (
        <span className="text-xs bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1 rounded-full">
          🗳️ {votesRemaining} vote{votesRemaining !== 1 ? 's' : ''} remaining
        </span>
      )}

      {/* Timer display */}
      {timeLeft !== null && (
        <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${
          timeLeft < 30000 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
        }`}>
          ⏱ {formatTime(timeLeft)}
        </span>
      )}

      {/* Facilitator controls */}
      {isFacilitator && facilitatorToken && (
        <div className="flex flex-wrap gap-2 ml-auto">
          {/* Timer buttons */}
          {phase !== 'done' && (
            <div className="flex gap-1">
              {[5, 10, 15].map(min => (
                <button
                  key={min}
                  onClick={() => onTimerSet(min * 60 * 1000, facilitatorToken)}
                  className="text-xs border border-gray-300 text-gray-600 px-2 py-1 rounded hover:border-gray-400 transition-colors"
                >
                  {min}m
                </button>
              ))}
              {timerEndsAt && (
                <button
                  onClick={() => onTimerSet(null, facilitatorToken)}
                  className="text-xs border border-red-300 text-red-500 px-2 py-1 rounded hover:bg-red-50"
                >
                  Stop timer
                </button>
              )}
            </div>
          )}

          {/* Export */}
          {(phase === 'discuss' || phase === 'done') && (
            <button
              onClick={() => onExport(facilitatorToken)}
              className="text-xs border border-green-400 text-green-600 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
            >
              Export JSON
            </button>
          )}

          {/* Clear cards */}
          {phase === 'write' && (
            confirmClear ? (
              <div className="flex gap-1">
                <button
                  onClick={() => { onClearCards(facilitatorToken); setConfirmClear(false); }}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                >
                  Confirm clear
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs border border-gray-300 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs border border-red-300 text-red-500 px-2 py-1 rounded hover:bg-red-50"
              >
                Clear all cards
              </button>
            )
          )}

          {/* Advance phase */}
          {nextPhase && (
            <button
              onClick={() => onPhaseAdvance(nextPhase, facilitatorToken)}
              className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              {NEXT_PHASE_LABEL[phase]} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
