import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path, type RouteKey } from '@/i18n/routes';
import { Wordmark } from '@/components/brand/Marks';

// Footer exakt aus Borderhaus_Homepage_v2.html: dunkel, 4-Spalten-Grid.
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const nav: { key: RouteKey; label: keyof Dictionary['nav'] }[] = [
    { key: 'howItWorks', label: 'howItWorks' },
    { key: 'services', label: 'services' },
    { key: 'locations', label: 'locations' },
    { key: 'pricing', label: 'pricing' },
  ];
  const resources: { key: RouteKey; label: keyof Dictionary['nav'] }[] = [
    { key: 'useCases', label: 'useCases' },
    { key: 'integrations', label: 'integrations' },
    { key: 'contact', label: 'contact' },
  ];
  const legal: { key: RouteKey; label: string }[] = [
    { key: 'imprint', label: dict.pages.imprint.title },
    { key: 'privacy', label: dict.pages.privacy.title },
    { key: 'terms', label: dict.pages.terms.title },
  ];

  const colTitle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: '#7d7d84',
    marginBottom: 14,
  };
  const linkStyle = 'text-[15px] text-grey-300 transition-colors hover:text-cream';

  return (
    <footer style={{ borderTop: '1px solid #1b1b1f', padding: 'clamp(40px,6vh,64px) clamp(20px,5vw,80px) 40px' }}>
      <div className="bh-footer-grid" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <Wordmark size={24} />
          <p style={{ fontSize: 15, lineHeight: 1.55, color: '#7d7d84', margin: '14px 0 0', maxWidth: 300 }}>{dict.footer.claim}</p>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#5a5a60', marginTop: 18 }}>
            {dict.footer.by}
          </div>
          {/* EU-Bio-Logo als Trust-Signal. */}
          <Image
            src="/images/eu-organic-logo.png"
            alt={locale === 'de' ? 'EU-Bio-Logo' : 'EU organic logo'}
            width={75}
            height={50}
            style={{ marginTop: 20, height: 'auto', width: 75 }}
          />
        </div>

        <div>
          <div style={colTitle}>{dict.footer.nav}</div>
          <div className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <Link key={item.key} href={path(locale, item.key)} className={linkStyle}>
                {dict.nav[item.label]}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={colTitle}>{dict.footer.resources}</div>
          <div className="flex flex-col gap-2.5">
            {resources.map((item) => (
              <Link key={item.key} href={path(locale, item.key)} className={linkStyle}>
                {dict.nav[item.label]}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={colTitle}>{dict.footer.legal}</div>
          <div className="flex flex-col gap-2.5">
            {legal.map((item) => (
              <Link key={item.key} href={path(locale, item.key)} className={linkStyle}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: '34px auto 0',
          borderTop: '1px solid #1b1b1f',
          paddingTop: 20,
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          color: '#5a5a60',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <span>{dict.footer.copyright}</span>
        <span>{dict.footer.domains}</span>
      </div>
    </footer>
  );
}
