'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function JoinSessionForm() {
  const router = useRouter();
  const { t } = useLanguage();
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
      setError(t('form.sessionNotFound'));
      setLoading(false);
      return;
    }
    router.push(`/session/${id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={sessionId}
          onChange={e => setSessionId(e.target.value)}
          placeholder={t('form.pasteJoinId')}
          className="flex-1 px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
          onFocus={e => { e.target.style.borderColor = 'var(--border-input-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
        />
        <button
          type="submit"
          disabled={loading || !sessionId.trim()}
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white disabled:opacity-50 transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,0.38)' }}
        >
          {loading ? '…' : t('form.joinSession')}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>}
    </form>
  );
}
