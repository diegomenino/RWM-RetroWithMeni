'use client';

import { useLanguage } from '@/components/providers/LanguageProvider';

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
      className="text-sm px-3 py-1.5 rounded-[10px] font-medium transition-all hover:-translate-y-px"
      style={{
        border: '1.5px solid var(--border-input)',
        background: 'var(--surface-solid)',
        color: 'var(--text-muted)',
      }}
    >
      {lang === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
