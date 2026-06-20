'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

// Tauscht das fuehrende Locale-Segment im aktuellen Pfad, behaelt den Rest.
export function LangSwitch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() || `/${locale}`;

  function swap(target: Locale): string {
    const parts = pathname.split('/');
    parts[1] = target; // Index 0 ist leer, Index 1 ist die Locale.
    return parts.join('/') || `/${target}`;
  }

  return (
    <div className="flex items-center gap-1 text-xs font-semibold" aria-label={dict.langSwitch.label}>
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted">/</span>}
          <Link
            href={swap(loc)}
            hrefLang={loc}
            aria-current={loc === locale ? 'true' : undefined}
            className={loc === locale ? 'text-accent' : 'text-grey-300 hover:text-cream'}
          >
            {dict.langSwitch[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
