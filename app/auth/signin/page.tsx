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

function SignInContent() {
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    getProviders().then(p => {
      if (p) setProviders(p);
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
      {Object.values(providers).map(provider => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id, { callbackUrl })}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-400 transition-colors"
        >
          <span>{PROVIDER_ICONS[provider.id] ?? '🔐'}</span>
          Continue with {provider.name}
        </button>
      ))}

      {Object.keys(providers).length === 0 && (
        <p className="text-center text-sm text-gray-400">
          No sign-in providers configured. Add environment variables to enable SSO.
        </p>
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
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-6 text-center text-sm text-gray-400">Loading...</div>}>
          <SignInContent />
        </Suspense>
      </div>
    </main>
  );
}
