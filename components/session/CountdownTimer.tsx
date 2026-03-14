'use client';

import { useState, useEffect, useRef } from 'react';

const DURATION_OPTIONS = [5, 10, 15] as const;

export function CountdownTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endsAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      const endsAt = Date.now() + selectedMinutes * 60 * 1000;
      endsAtRef.current = endsAt;
      setTimeLeft(selectedMinutes * 60 * 1000);

      intervalRef.current = setInterval(() => {
        const remaining = (endsAtRef.current ?? 0) - Date.now();
        if (remaining <= 0) {
          setTimeLeft(0);
          setRunning(false);
          clearInterval(intervalRef.current!);
        } else {
          setTimeLeft(remaining);
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function handleToggle() {
    if (running) {
      setRunning(false);
      setTimeLeft(null);
    } else {
      setRunning(true);
    }
  }

  function handleSelectMinutes(min: number) {
    if (running) return;
    setSelectedMinutes(min);
    setTimeLeft(null);
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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white border border-gray-200 shadow-xl rounded-2xl px-5 py-3">
      {/* Duration options */}
      <div className="flex gap-1">
        {DURATION_OPTIONS.map(min => (
          <button
            key={min}
            onClick={() => handleSelectMinutes(min)}
            disabled={running}
            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedMinutes === min && !running
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-600 hover:border-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {min}m
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Countdown display */}
      <span
        className={`text-2xl font-mono font-bold w-16 text-center tabular-nums transition-colors ${
          isDone
            ? 'text-green-600'
            : isCritical
            ? 'text-red-500'
            : 'text-gray-800'
        }`}
      >
        {isDone ? '0:00' : formatTime(displayMs)}
      </span>

      {/* Start / Stop button */}
      <button
        onClick={handleToggle}
        className={`text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors ${
          running
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {running ? 'Stop' : isDone ? 'Restart' : 'Start'}
      </button>
    </div>
  );
}
