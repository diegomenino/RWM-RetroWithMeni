'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (localStorage.getItem('rwm_display_name')) {
      router.replace('/home');
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem('rwm_display_name', username.trim());
    localStorage.setItem('rwm_email', email.trim());
    router.push('/home');
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4 px-3 py-3"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
          >
            RWM [v{process.env.NEXT_PUBLIC_APP_VERSION}]
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('home.subtitle')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
          style={{ background: 'var(--surface)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--panel-shadow)' }}
        >
          <h2 className="text-[17px] font-extrabold mb-5" style={{ color: 'var(--text)' }}>{t('login.title')}</h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t('login.username')}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={t('login.usernamePlaceholder')}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all"
              style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t('login.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all"
              style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
            />
          </div>

          <button
            type="submit"
            disabled={!username.trim() || !email.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
          >
            {t('login.enter')}
          </button>
        </form>
      </div>
    </main>
  );
}
