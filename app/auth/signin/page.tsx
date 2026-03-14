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
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
      {/* SSO buttons */}
      {ssoProviders.map(provider => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id, { callbackUrl })}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-400 transition-colors"
        >
          <span>{PROVIDER_ICONS[provider.id]}</span>
          Continue with {provider.name}
        </button>
      ))}

      {/* Divider when both exist */}
      {ssoProviders.length > 0 && hasEmailOnly && (
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">RWM</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-6 text-center text-sm text-gray-400">Loading…</div>}>
          <SignInContent />
        </Suspense>
      </div>
    </main>
  );
}
