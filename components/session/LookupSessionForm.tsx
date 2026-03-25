'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LookupSessionForm() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = sessionId.trim();
    if (!id) return;
    setLoading(true);
    setError('');
    const res = await fetch(`/api/sessions/${id}`);
    if (!res.ok) {
      setError('Session not found. Check the ID and try again.');
      setLoading(false);
      return;
    }
    router.push(`/session/${id}/view`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={sessionId}
          onChange={e => setSessionId(e.target.value)}
          placeholder="Paste session ID…"
          className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
          onFocus={e => { e.target.style.borderColor = 'var(--border-input-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          type="submit"
          disabled={loading || !sessionId.trim()}
          className="text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-all hover:-translate-y-px"
          style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-solid)', color: 'var(--text-secondary)' }}
        >
          {loading ? '…' : 'View'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>}
    </form>
  );
}
