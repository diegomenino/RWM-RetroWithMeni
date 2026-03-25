'use client';

import { useState, useRef, useEffect } from 'react';

interface CardFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
}

export function CardForm({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Add a card…',
  submitLabel = 'Add',
}: CardFormProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent); }
    if (e.key === 'Escape' && onCancel) onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 text-sm rounded-xl outline-none resize-none transition-all"
        style={{ border: '1.5px solid var(--border-input)', background: 'var(--surface-dim)', color: 'var(--text)' }}
        onFocus={e => { e.target.style.borderColor = 'var(--border-input-focus)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
      />
      <div className="flex gap-2 mt-1 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="text-sm px-2 py-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            ✕ Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!value.trim()}
          className="text-sm text-white px-3 py-1 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 3px 10px rgba(99,102,241,0.3)' }}
        >
          ✓ {submitLabel}
        </button>
      </div>
    </form>
  );
}
