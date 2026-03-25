'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import en from '@/lib/i18n/en.json';
import es from '@/lib/i18n/es.json';

const translations = { en, es };
type Lang = 'en' | 'es';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('rwm-lang') as Lang | null;
    if (stored === 'en' || stored === 'es') {
      setLangState(stored);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('rwm-lang', l);
  }

  function t(key: string, replacements?: Record<string, string>): string {
    const dict = translations[lang] as Record<string, string>;
    let value = dict[key] ?? key;

    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, replacement]) => {
        value = value.replace(`{{${placeholder}}}`, replacement);
      });
    }

    return value;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
