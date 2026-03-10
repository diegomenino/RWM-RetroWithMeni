'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RETRO_FORMATS } from '@/lib/retro-formats';

const FORMAT_IDS = Object.keys(RETRO_FORMATS) as Array<keyof typeof RETRO_FORMATS>;

export function CreateSessionForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [format, setFormat] = useState('start-stop-continue');
  const [maxVotes, setMaxVotes] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, format, maxVotes }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create session');
        return;
      }

      const { sessionId, facilitatorToken } = await res.json();
      localStorage.setItem(`facilitator_${sessionId}`, facilitatorToken);
      router.push(`/session/${sessionId}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Session Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sprint 42 Retrospective"
          required
          maxLength={100}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Format
        </label>
        <div className="grid grid-cols-1 gap-2">
          {FORMAT_IDS.map(id => {
            const fmt = RETRO_FORMATS[id];
            return (
              <label
                key={id}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  format === id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={id}
                  checked={format === id}
                  onChange={() => setFormat(id)}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-sm">{fmt.label}</div>
                  <div className="text-xs text-gray-500">{fmt.description}</div>
                  <div className="flex gap-1 mt-1">
                    {fmt.columns.map(col => (
                      <span
                        key={col.id}
                        className={`text-xs px-2 py-0.5 rounded-full ${col.color} ${col.border} border`}
                      >
                        {col.emoji} {col.label}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Votes per person
        </label>
        <select
          value={maxVotes}
          onChange={e => setMaxVotes(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => (
            <option key={n} value={n}>{n} vote{n !== 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating…' : 'Create Session'}
      </button>
    </form>
  );
}
