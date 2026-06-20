'use client';

import { useEffect, useState } from 'react';
import type { Dictionary } from '@/i18n';

const KEY = 'bh-consent';

// Datensparsamer Consent-Banner. Analyse (Plausible/Umami) ist cookielos, daher
// ist Statistik optional und ohne sie laeuft die Seite voll funktionsfaehig.
export function CookieBanner({ dict }: { dict: Dictionary }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function choose(value: 'all' | 'necessary') {
    localStorage.setItem(KEY, value);
    setVisible(false);
    if (value === 'all') {
      window.dispatchEvent(new CustomEvent('bh-consent-granted'));
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-panel text-cream"
    >
      <div className="container-bh flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-grey-200">{dict.cookie.text}</p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="btn-on-dark" onClick={() => choose('necessary')}>
            {dict.cookie.decline}
          </button>
          <button type="button" className="btn-primary" onClick={() => choose('all')}>
            {dict.cookie.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
