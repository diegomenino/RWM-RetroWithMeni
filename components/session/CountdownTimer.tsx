'use client';

import { useState, useEffect, useRef } from 'react';

const DURATION_OPTIONS = [5, 10, 15] as const;

interface CountdownTimerProps {
  sessionId: string;
  timerEndsAt: number | null;
  onTimerSet: (durationMs: number | null) => void;
}

export function CountdownTimer({ sessionId, timerEndsAt, onTimerSet }: CountdownTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = timerEndsAt !== null;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!timerEndsAt) {
      setTimeLeft(null);
      return;
    }

    const update = () => {
      const remaining = timerEndsAt - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    };
    update();
    intervalRef.current = setInterval(update, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerEndsAt]);

  function handleToggle() {
    if (isRunning) {
      onTimerSet(null);
    } else {
      onTimerSet(selectedMinutes * 60 * 1000);
    }
  }

  function formatTime(ms: number) {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const displayMs = timeLeft ?? selectedMinutes * 60 * 1000;
  const isCritical = timeLeft !== null && timeLeft < 30000;
  const isDone = timeLeft === 0;

  return (
    <div className="border-t border-gray-200 bg-white py-3 flex justify-center">
      <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl shadow-md px-6 py-2.5">
        {/* Duration options */}
        <div className="flex gap-1.5">
          {DURATION_OPTIONS.map(min => (
            <button
              key={min}
              onClick={() => setSelectedMinutes(min)}
              disabled={isRunning}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedMinutes === min && !isRunning
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {min}m
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Countdown display */}
        <span
          className={`text-3xl font-mono font-bold w-20 text-center tabular-nums transition-colors ${
            isDone
              ? 'text-green-600'
              : isCritical
              ? 'text-red-500'
              : 'text-gray-800'
          }`}
        >
          {isDone ? '0:00' : formatTime(displayMs)}
        </span>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Start / Stop button */}
        <button
          onClick={handleToggle}
          className={`text-sm font-semibold px-5 py-2 rounded-xl transition-colors ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isRunning ? 'Stop' : isDone ? 'Restart' : 'Start'}
        </button>
      </div>
    </div>
  );
}
