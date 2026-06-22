import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { Icon } from '@/components/brand/Icon';
import { INTEGRATIONS } from '@/config/integrations';
import { publicAsset } from '@/lib/assets';

const CREAM = '#f5f3ee';

// Preisrechner-Teaser, weiße Karte auf Cream (exakt aus Vorlage).
export function CalcTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.home.calcTeaser;
  return (
    <section style={{ background: CREAM, color: '#0b0b0c', padding: 'clamp(40px,6vh,80px) clamp(20px,5vw,80px)' }}>
      <div
        className="bh-calc-teaser"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          background: '#fff',
          border: '1px solid #e6e3dc',
          borderRadius: 16,
          padding: 'clamp(28px,4vw,52px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 40,
          alignItems: 'center',
          boxShadow: '0 1px 0 rgba(0,0,0,.03)',
        }}
      >
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 16 }}>
            {c.label}
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px,3.4vw,44px)', fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 14px' }}>
            {c.t}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: '#3a3a40', margin: '0 0 26px', maxWidth: 560 }}>{c.b}</p>
          <Link href={path(locale, 'pricing')} className="bh-cta" style={{ display: 'inline-block', background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
            {c.cta}
          </Link>
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: '#6f6f76', letterSpacing: '.16em', textTransform: 'uppercase' }}>{c.from}</div>
          <div style={{ fontSize: 'clamp(34px,4.4vw,52px)', fontWeight: 700, color: '#0b0b0c', lineHeight: 1, marginTop: 8 }}>{c.value}</div>
          <div style={{ fontSize: 14, color: '#6f6f76', marginTop: 6 }}>{c.unit}</div>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, color: '#6f6f76', marginTop: 10, maxWidth: 240, marginLeft: 'auto', lineHeight: 1.45 }}>{c.incl}</div>
        </div>
      </div>
    </section>
  );
}

// Integrationen-Leiste mit dunklen Logo-Kacheln auf Cream.
export function IntegrationsStrip({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.home.integrationsStrip;
  return (
    <section style={{ background: CREAM, color: '#0b0b0c', padding: 'clamp(40px,6vh,80px) clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>
            {s.t}
          </h2>
          <Link href={path(locale, 'integrations')} className="bh-nav-link" style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: '#ff4a1c' }}>
            {s.all} &rarr;
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
          {INTEGRATIONS.map((ig) => (
            <div
              key={ig.name}
              className="bh-card"
              style={{
                background: '#141417',
                border: '1px solid #26262a',
                borderRadius: 12,
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 96,
              }}
            >
              {ig.logo && publicAsset(ig.logo) ? (
                ig.showName ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                    <Image src={ig.logo} alt={ig.name} width={40} height={40} loading="eager" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#f5f3ee', letterSpacing: '-.01em' }}>{ig.name}</span>
                  </span>
                ) : (
                  <Image src={ig.logo} alt={ig.name} width={150} height={40} loading="eager" style={{ maxHeight: 36, maxWidth: '80%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                )
              ) : (
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#f5f3ee', letterSpacing: '-.01em' }}>{ig.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Impact- / Use-Case- / Knowledge-Teaser-Reihe auf Cream.
export function TeaserRow({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.teaser;
  return (
    <section style={{ background: CREAM, color: '#0b0b0c', padding: 'clamp(40px,6vh,80px) clamp(20px,5vw,80px)' }}>
      <div className="bh-teaser-grid" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Link href={path(locale, 'impact')} className="bh-card" style={{ gridColumn: '1/-1', background: 'linear-gradient(110deg,#1c1410,#141417)', border: '1px solid #3a2a20', borderRadius: 16, padding: 'clamp(28px,3.4vw,40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 9 }}>
              <Icon name="heart-handshake" size={18} />
              {t.impLabel}
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px,2.6vw,34px)', fontWeight: 700, margin: '0 0 10px', letterSpacing: '-.01em', color: '#f5f3ee' }}>
              {t.impHomeT}
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: '#dcdbd9', margin: 0 }}>{t.impHomeB}</p>
          </div>
          <span className="bh-cta" style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: '14px 24px', borderRadius: 9, whiteSpace: 'nowrap' }}>
            {t.impHomeCta} &rarr;
          </span>
        </Link>

        <Link href={path(locale, 'useCases')} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 36, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 14 }}>{t.ucLabel}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: '0 0 12px', color: '#0b0b0c' }}>{t.ucHomeT}</h3>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: '#3a3a40', margin: '0 0 18px' }}>{t.ucHomeB}</p>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: '#ff4a1c' }}>{t.ucRead} &rarr;</span>
        </Link>

        <Link href={path(locale, 'knowledge')} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 36, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 14 }}>{t.kbLabel}</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: '0 0 12px', color: '#0b0b0c' }}>{t.kbHomeT}</h3>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: '#3a3a40', margin: '0 0 18px' }}>{t.kbHomeB}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {t.kbTopics.map((topic) => (
              <span key={topic} style={{ fontSize: 13, border: '1px solid #cfcabf', borderRadius: 999, padding: '7px 13px', color: '#5a5a62' }}>{topic}</span>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}

// Abschluss-CTA dunkel, zentrierte Gradient-Karte.
export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const f = dict.home.final;
  return (
    <section style={{ padding: 'clamp(48px,7vh,96px) clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(180deg,#141417,#0e0e10)', border: '1px solid #26262a', borderRadius: 18, padding: 'clamp(36px,5vw,64px)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(30px,4vw,52px)', fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 16px' }}>{f.t}</h2>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#dcdbd9', maxWidth: 560, margin: '0 auto 30px' }}>{f.b}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={path(locale, 'pricing')} className="bh-cta" style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 17, padding: '15px 30px', borderRadius: 10 }}>
            {dict.home.hero.cta1}
          </Link>
          <Link href={path(locale, 'book')} className="bh-cta" style={{ border: '1px solid #3a3a40', color: '#f5f3ee', fontWeight: 600, fontSize: 17, padding: '15px 30px', borderRadius: 10 }}>
            {dict.nav.book}
          </Link>
          <Link href={path(locale, 'contact')} className="bh-cta" style={{ border: '1px solid #3a3a40', color: '#f5f3ee', fontWeight: 600, fontSize: 17, padding: '15px 30px', borderRadius: 10 }}>
            {f.cta2}
          </Link>
        </div>
      </div>
    </section>
  );
}
