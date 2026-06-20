'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path, type RouteKey } from '@/i18n/routes';
import { Logo } from '@/components/brand/Logo';
import { LangSwitch } from './LangSwitch';

// Header und Nav: immer schwarz (#0b0b0c), fix auf jeder Seite (Abschnitt 3a).
const NAV: { key: RouteKey; label: keyof Dictionary['nav'] }[] = [
  { key: 'howItWorks', label: 'howItWorks' },
  { key: 'impact', label: 'impact' },
  { key: 'whoFor', label: 'whoFor' },
  { key: 'services', label: 'services' },
  { key: 'integrations', label: 'integrations' },
  { key: 'locations', label: 'locations' },
  { key: 'pricing', label: 'pricing' },
  { key: 'useCases', label: 'useCases' },
  { key: 'knowledge', label: 'knowledge' },
];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-canvas text-cream">
      <div className="container-bh flex h-16 items-center justify-between gap-4">
        <Link href={path(locale, 'home')} className="shrink-0" aria-label="Borderhaus">
          <Logo onDark />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label={dict.nav.menu}>
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={path(locale, item.key)}
              className="text-sm text-grey-300 transition-colors hover:text-cream"
            >
              {dict.nav[item.label]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LangSwitch locale={locale} dict={dict} />
          <Link href={path(locale, 'contact')} className="btn-primary">
            {dict.cta.requestQuote}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-cream xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? dict.nav.close : dict.nav.menu}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-white/10 bg-canvas xl:hidden">
          <nav className="container-bh flex flex-col gap-1 py-4" aria-label={dict.nav.menu}>
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={path(locale, item.key)}
                className="rounded-lg px-2 py-2.5 text-base text-grey-200 hover:bg-panel"
                onClick={() => setOpen(false)}
              >
                {dict.nav[item.label]}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3">
              <LangSwitch locale={locale} dict={dict} />
              <Link
                href={path(locale, 'contact')}
                className="btn-primary flex-1"
                onClick={() => setOpen(false)}
              >
                {dict.cta.requestQuote}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
