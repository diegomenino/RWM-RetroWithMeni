'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Provider {
  id: string;
  name: string;
}

const PROVIDER_ICONS: Record<string, string> = {
  google: '🔵',
  'azure-ad': '🟦',
};

const SSO_PROVIDERS = ['google', 'azure-ad'];

function SignInContent() {
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    getProviders().then(p => { if (p) setProviders(p); });
  }, []);

  const ssoProviders = Object.values(providers).filter(p => SSO_PROVIDERS.includes(p.id));
  const hasEmailOnly = !!providers['email-only'];

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;
    setLoading(true);
    const res = await signIn('email-only', { email, callbackUrl, redirect: false });
    if (res?.error) {
      setError('Invalid email address.');
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  }

  return (
    <div className="p-6 flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.1)', boxShadow: '0 8px 32px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* SSO buttons */}
      {ssoProviders.map(provider => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id, { callbackUrl })}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 rounded-xl transition-all hover:-translate-y-px"
          style={{ border: '1.5px solid #e0e7ff', background: 'white', boxShadow: '0 1px 4px rgba(99,102,241,0.06)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#a5b4fc'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e0e7ff'; }}
        >
          <span>{PROVIDER_ICONS[provider.id]}</span>
          Continue with {provider.name}
        </button>
      ))}

      {/* Divider when both exist */}
      {ssoProviders.length > 0 && hasEmailOnly && (
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px" style={{ background: '#e0e7ff' }} />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px" style={{ background: '#e0e7ff' }} />
        </div>
      )}

      {/* Email-only form */}
      {hasEmailOnly && (
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
            style={{ border: '1.5px solid #e0e7ff', background: '#fafbff' }}
            onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
            onBlur={e => { e.target.style.borderColor = '#e0e7ff'; e.target.style.background = '#fafbff'; e.target.style.boxShadow = 'none'; }}
          />
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white px-4 py-3 text-sm font-semibold rounded-xl disabled:opacity-50 transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea)', boxShadow: '0 4px 14px rgba(99,102,241,0.38)' }}
          >
            {loading ? 'Signing in…' : 'Continue with Email'}
          </button>
        </form>
      )}

      {Object.keys(providers).length === 0 && (
        <p className="text-center text-sm text-gray-400">Loading…</p>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            R
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome to RWM</h1>
          <p className="text-sm text-gray-400">Sign in to continue</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-6 text-center text-sm text-gray-400">Loading…</div>}>
          <SignInContent />
        </Suspense>
      </div>
    </main>
  );
}
