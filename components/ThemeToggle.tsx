'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rwm-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('rwm-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-sm px-3 py-1.5 rounded-[10px] font-medium transition-all hover:-translate-y-px"
      style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-solid)', color: 'var(--text-muted)' }}
    >
      {dark ? '☀' : '🌙'}
    </button>
  );
}
