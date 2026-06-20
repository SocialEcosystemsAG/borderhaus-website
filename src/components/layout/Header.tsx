'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path, type RouteKey } from '@/i18n/routes';
import { Wordmark } from '@/components/brand/Marks';
import { LangSwitch } from './LangSwitch';

// Nav exakt aus Borderhaus_Homepage_v2.html: fixed, 72px, blur, translucent.
const NAV: { key: RouteKey; label: keyof Dictionary['nav']; accent?: boolean }[] = [
  { key: 'howItWorks', label: 'howItWorks' },
  { key: 'services', label: 'services' },
  { key: 'integrations', label: 'integrations' },
  { key: 'locations', label: 'locations' },
  { key: 'impact', label: 'impact', accent: true },
  { key: 'useCases', label: 'useCases' },
];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b border-[#1b1b1f] px-[clamp(20px,4vw,56px)]"
      style={{ background: 'rgba(11,11,12,.82)', backdropFilter: 'blur(12px)' }}
    >
      <Link href={path(locale, 'home')} aria-label="Borderhaus" className="shrink-0">
        <Wordmark size={26} />
      </Link>

      <div className="flex items-center gap-[clamp(14px,2vw,30px)]">
        <nav className="hidden items-center gap-[clamp(14px,2vw,30px)] lg:flex" aria-label={dict.nav.menu}>
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={path(locale, item.key)}
              className="bh-nav-link"
              style={
                item.accent
                  ? { color: '#ff4a1c', fontWeight: 700, fontSize: 15 }
                  : { fontSize: 15, fontWeight: 500 }
              }
            >
              {dict.nav[item.label]}
            </Link>
          ))}
        </nav>

        <LangSwitch locale={locale} dict={dict} />

        <Link
          href={path(locale, 'pricing')}
          className="bh-cta hidden sm:inline-flex"
          style={{
            background: '#ff4a1c',
            color: '#0b0b0c',
            fontWeight: 700,
            fontSize: 15,
            padding: '11px 20px',
            borderRadius: 9,
          }}
        >
          {dict.nav.pricing}
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center p-1.5 text-cream lg:hidden"
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
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-[72px] border-b border-[#1b1b1f] bg-canvas lg:hidden"
        >
          <nav className="flex flex-col gap-1 px-[clamp(20px,5vw,56px)] py-4" aria-label={dict.nav.menu}>
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={path(locale, item.key)}
                className="rounded-lg px-2 py-2.5 text-base text-grey-200 hover:bg-panel"
                style={item.accent ? { color: '#ff4a1c', fontWeight: 700 } : undefined}
                onClick={() => setOpen(false)}
              >
                {dict.nav[item.label]}
              </Link>
            ))}
            <Link
              href={path(locale, 'pricing')}
              className="mt-3 rounded-lg bg-accent px-4 py-3 text-center font-semibold text-canvas"
              onClick={() => setOpen(false)}
            >
              {dict.nav.pricing}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
