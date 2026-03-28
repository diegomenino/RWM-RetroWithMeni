'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface SessionData {
  id: string;
  name: string;
  format: string;
  phase: string;
  created_at: number;
}

export function SessionList() {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions');
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error('Failed to load sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  if (loading) {
    return <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</div>;
  }

  if (sessions.length === 0) {
    return <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>{t('home.noSessions')}</p>;
  }

  const phaseColors: Record<string, string> = {
    write: 'bg-blue-100 text-blue-700',
    vote: 'bg-purple-100 text-purple-700',
    discuss: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {sessions.map(session => (
        <Link
          key={session.id}
          href={`/session/${session.id}/view`}
          className="block p-3 rounded-lg border transition-all hover:border-indigo-400 hover:bg-opacity-50"
          style={{
            background: 'var(--surface-dim)',
            border: '1px solid var(--border-input)',
            textDecoration: 'none',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>
                {session.name}
              </p>
              <p className="text-xs font-mono truncate" style={{ color: 'var(--text-muted)' }}>
                {session.id}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${phaseColors[session.phase] || 'bg-gray-100 text-gray-700'}`}>
              {session.phase}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
