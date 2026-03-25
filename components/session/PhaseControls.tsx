'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

const PHASES = ['write', 'vote', 'discuss', 'done'] as const;
type Phase = typeof PHASES[number];

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
  const { t } = useLanguage();
  const [confirmClear, setConfirmClear] = useState(false);

  const PHASE_LABELS: Record<Phase, string> = {
    write: `✍️ ${t('phase.write')}`,
    vote: `🗳️ ${t('phase.vote')}`,
    discuss: `💬 ${t('phase.discuss')}`,
    done: `✅ ${t('phase.done')}`,
  };

  const NEXT_PHASE_LABEL: Record<string, string> = {
    write: t('phase.revealAndVote'),
    vote: t('phase.startDiscussion'),
    discuss: t('phase.finishSession'),
  };

  const currentPhaseIdx = PHASES.indexOf(phase as Phase);
  const nextPhase = PHASES[currentPhaseIdx + 1] as Phase | undefined;

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
          🗳️ {votesRemaining} {votesRemaining !== 1 ? t('board.votesRemaining') : t('board.voteRemaining')}
        </span>
      )}

      {/* Facilitator controls */}
      {isFacilitator && facilitatorToken && (
        <div className="flex flex-wrap gap-2 ml-auto">
          {/* Export */}
          {(phase === 'discuss' || phase === 'done') && (
            <button
              onClick={() => onExport(facilitatorToken)}
              className="text-xs px-3 py-1.5 rounded-[10px] font-semibold transition-all hover:-translate-y-px"
              style={{ border: '1.5px solid #86efac', color: '#16a34a', background: 'white' }}
            >
              {t('phase.exportJson')}
            </button>
          )}

          {/* Clear cards */}
          {phase === 'write' && (
            confirmClear ? (
              <div className="flex gap-1">
                <button
                  onClick={() => { onClearCards(facilitatorToken); setConfirmClear(false); }}
                  className="text-xs text-white px-3 py-1.5 rounded-[10px] font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 3px 10px rgba(239,68,68,0.3)' }}
                >
                  {t('phase.confirmClear')}
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs px-3 py-1.5 rounded-[10px] font-medium transition-all"
                  style={{ border: '1.5px solid #e0e7ff', color: '#6b7280', background: 'white' }}
                >
                  {t('phase.cancel')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs px-3 py-1.5 rounded-[10px] font-semibold transition-all hover:-translate-y-px"
                style={{ border: '1.5px solid #fca5a5', color: '#ef4444', background: 'white' }}
              >
                {t('phase.clearCards')}
              </button>
            )
          )}

          {/* Advance phase */}
          {nextPhase && (
            <button
              onClick={() => onPhaseAdvance(nextPhase, facilitatorToken)}
              className="text-xs text-white px-3 py-1.5 rounded-[10px] font-semibold transition-all hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,0.38)' }}
            >
              {NEXT_PHASE_LABEL[phase]} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
