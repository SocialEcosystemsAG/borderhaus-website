import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { HeroHausMotif } from '@/components/brand/Marks';

// Hero exakt aus Borderhaus_Homepage_v2.html: dunkel, Grid 1.15/.85,
// Haus-Blitz-Motiv rechts. Claim freigegeben, dritte Zeile in Orange.
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(48px,8vh,110px) clamp(20px,5vw,80px) clamp(40px,6vh,80px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.15fr .85fr',
          gap: 56,
          alignItems: 'center',
        }}
        className="bh-hero-grid"
      >
        <div className="bh-reveal">
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: '#ff4a1c',
              marginBottom: 24,
            }}
          >
            {h.eyebrow}
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(44px,6vw,86px)',
              lineHeight: 0.96,
              fontWeight: 700,
              letterSpacing: '-.03em',
              margin: 0,
            }}
          >
            {h.t1}
            <br />
            {h.t2}
            <br />
            <span style={{ color: '#ff4a1c' }}>{h.t3}</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(17px,1.5vw,21px)',
              lineHeight: 1.55,
              color: '#dcdbd9',
              maxWidth: 540,
              margin: '28px 0 0',
            }}
          >
            {h.sub}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36 }}>
            <Link
              href={path(locale, 'pricing')}
              className="bh-cta"
              style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 17, padding: '15px 28px', borderRadius: 10 }}
            >
              {h.cta1}
            </Link>
            <Link
              href={path(locale, 'howItWorks')}
              className="bh-cta"
              style={{ border: '1px solid #3a3a40', color: '#f5f3ee', fontWeight: 600, fontSize: 17, padding: '15px 28px', borderRadius: 10 }}
            >
              {h.cta2}
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 34, marginTop: 46, flexWrap: 'wrap' }}>
            {h.stats.map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 30, fontWeight: 700, color: '#f5f3ee' }}>
                  {s.v}
                </div>
                <div style={{ fontSize: 13, color: '#7d7d84', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bh-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <HeroHausMotif />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 'min(300px,60vw)',
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              letterSpacing: '.22em',
              color: '#7d7d84',
            }}
          >
            <span>NL</span>
            <span>DE</span>
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#ff4a1c',
            }}
          >
            {h.tagline}
          </div>
        </div>
      </div>
    </section>
  );
}
