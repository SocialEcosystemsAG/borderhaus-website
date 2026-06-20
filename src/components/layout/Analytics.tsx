'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Datensparsame, cookielose Analyse (Plausible oder Umami). Laedt erst nach
// erteilter Statistik-Einwilligung. Domain/Skript via Env konfigurierbar.
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('bh-consent') === 'all') setAllowed(true);
    const handler = () => setAllowed(true);
    window.addEventListener('bh-consent-granted', handler);
    return () => window.removeEventListener('bh-consent-granted', handler);
  }, []);

  if (!allowed || !PLAUSIBLE_DOMAIN) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src={PLAUSIBLE_SRC}
      strategy="afterInteractive"
    />
  );
}
