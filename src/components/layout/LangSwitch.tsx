'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

// DE/EN-Umschalter exakt aus Vorlage: Border #3a3a40, Space Mono, aktiv orange.
export function LangSwitch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() || `/${locale}`;

  function swap(target: Locale): string {
    const parts = pathname.split('/');
    parts[1] = target;
    return parts.join('/') || `/${target}`;
  }

  return (
    <div
      className="flex items-center"
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 13,
        border: '1px solid #3a3a40',
        borderRadius: 7,
        overflow: 'hidden',
      }}
      aria-label={dict.langSwitch.label}
    >
      {locales.map((loc) => {
        const active = loc === locale;
        return (
          <Link
            key={loc}
            href={swap(loc)}
            hrefLang={loc}
            aria-current={active ? 'true' : undefined}
            style={
              active
                ? { padding: '5px 11px', background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700 }
                : { padding: '5px 11px', color: '#bcbcbf' }
            }
          >
            {dict.langSwitch[loc]}
          </Link>
        );
      })}
    </div>
  );
}
