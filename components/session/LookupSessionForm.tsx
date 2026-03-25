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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={sessionId}
        onChange={e => setSessionId(e.target.value)}
        placeholder="Paste session ID…"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={loading || !sessionId.trim()}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Looking up…' : 'View'}
      </button>
      {error && <p className="col-span-2 text-red-500 text-xs">{error}</p>}
    </form>
  );
}
