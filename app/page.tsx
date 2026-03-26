'use client';

import { useState } from 'react';
import { CreateSessionForm } from '@/components/session/CreateSessionForm';
import { LookupSessionForm } from '@/components/session/LookupSessionForm';
import { SessionList } from '@/components/session/SessionList';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();
  const [showSessions, setShowSessions] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4 px-3 py-3"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            RWM
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">RWM [v{process.env.NEXT_PUBLIC_APP_VERSION}]</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('home.subtitle')}</p>
        </div>

        <div className="p-6 relative z-10" style={{ background: 'var(--surface)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--panel-shadow)' }}>
          <h2 className="text-[17px] font-extrabold mb-4" style={{ color: 'var(--text)' }}>{t('home.createSession')}</h2>
          <CreateSessionForm />
        </div>

        <div className="p-5 mt-4 relative z-10" style={{ background: 'var(--surface)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--panel-shadow)' }}>
          <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-secondary)' }}>{t('home.viewSession')}</h2>
          <LookupSessionForm />
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-subtle)' }}>
          {t('home.sessionLinkHint')}
        </p>

        <button
          onClick={() => setShowSessions(s => !s)}
          className="w-full mt-4 text-sm px-4 py-2.5 rounded-xl font-medium transition-all hover:-translate-y-px"
          style={{ background: 'var(--surface-solid)', border: '1.5px solid var(--border-input)', color: 'var(--text-secondary)' }}
        >
          {t('home.browseSessions')}
        </button>

        {showSessions && (
          <div className="p-5 mt-4 relative z-10" style={{ background: 'var(--surface)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--panel-shadow)' }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-secondary)' }}>{t('home.allSessions')}</h2>
            <SessionList />
          </div>
        )}
      </div>
    </main>
  );
}
