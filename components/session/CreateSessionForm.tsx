'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RETRO_FORMATS } from '@/lib/retro-formats';

const FORMAT_IDS = Object.keys(RETRO_FORMATS) as Array<keyof typeof RETRO_FORMATS>;

export function CreateSessionForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [format, setFormat] = useState('went-well-improve');
  const [maxVotes, setMaxVotes] = useState(5);
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
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
          Session Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sprint 42 Retrospective"
          required
          maxLength={100}
          className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
          onFocus={e => { e.target.style.borderColor = 'var(--border-input-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
          Format
        </label>
        <div className="grid grid-cols-1 gap-2">
          {FORMAT_IDS.map(id => {
            const fmt = RETRO_FORMATS[id];
            const selected = format === id;
            return (
              <label
                key={id}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  border: selected ? '1.5px solid var(--border-input-focus)' : '1.5px solid var(--border-input)',
                  background: selected ? 'rgba(99,102,241,0.08)' : 'var(--surface-solid)',
                  boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={id}
                  checked={selected}
                  onChange={() => setFormat(id)}
                  className="mt-0.5 accent-indigo-600"
                />
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{fmt.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{fmt.description}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {fmt.columns.map(col => (
                      <span
                        key={col.id}
                        className={`text-xs px-2 py-0.5 rounded-full ${col.color} border ${col.border}`}
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
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
          Votes per person
        </label>
        <select
          value={maxVotes}
          onChange={e => setMaxVotes(Number(e.target.value))}
          className="px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
          onFocus={e => { e.target.style.borderColor = 'var(--border-input-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => (
            <option key={n} value={n}>{n} vote{n !== 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full text-white py-2.5 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-px"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea)', boxShadow: '0 4px 14px rgba(99,102,241,0.38)' }}
      >
        {loading ? 'Creating…' : 'Create Session'}
      </button>
    </form>
  );
}
