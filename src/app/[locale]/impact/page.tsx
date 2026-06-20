import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { Icon } from '@/components/brand/Icon';
import { Blitz } from '@/components/brand/Marks';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({
    locale: loc,
    routeKey: 'impact',
    title: dict.pages.impact.title,
    description: dict.impactPage.heroSub,
  });
}

// Impact-Seite exakt nach Borderhaus_Impact_Rhythmus.html.
export default async function ImpactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.impactPage;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.impact, url: path(loc, 'impact') },
        ]}
      />

      {/* HERO dunkel */}
      <section style={{ padding: 'clamp(56px,8vh,104px) clamp(20px,5vw,80px) clamp(40px,5vh,64px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="heart-handshake" size={20} />
            {p.heroLabel}
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(40px,6vw,84px)', fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 22px', lineHeight: 0.98 }}>
            {p.heroT}
          </h1>
          <p style={{ fontSize: 'clamp(18px,2vw,23px)', lineHeight: 1.5, color: '#dcdbd9', maxWidth: 760, margin: 0 }}>{p.heroSub}</p>
        </div>
      </section>

      {/* BRANDS hell */}
      <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(56px,7vh,88px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(30px,4vw,52px)', fontWeight: 700, letterSpacing: '-.02em', margin: 0, color: '#0b0b0c' }}>{p.custT}</h2>
            <span style={{ fontSize: 15, color: '#6f6f76', maxWidth: 340, lineHeight: 1.5 }}>{p.custSub}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 22 }}>
            {p.customers.map((cu) => (
              <div key={cu.name} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 18, padding: 30, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                  <div style={{ height: 50, minWidth: 120, display: 'flex', alignItems: 'center', padding: '0 18px', background: '#faf8f3', border: '1px dashed #d6d1c6', borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, color: '#0b0b0c' }}>
                    {cu.name}
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a7a299', textAlign: 'right', flex: 'none', maxWidth: 90, lineHeight: 1.4 }}>{p.logoSlot}</span>
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 14 }}>{cu.tag}</div>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: '#3a3a40', margin: 0, flex: 1 }}>{cu.impact}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, borderTop: '1px solid #ece9e1', marginTop: 24, paddingTop: 22 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: '#ff4a1c', lineHeight: 1 }}>{cu.fact}</span>
                  <span style={{ fontSize: 14, color: '#6f6f76', lineHeight: 1.3 }}>{cu.factL}</span>
                </div>
              </div>
            ))}
            {/* DEINE BRAND Karte */}
            <div style={{ background: '#0b0b0c', border: '1px solid #2a2a2f', borderRadius: 18, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ffd23f', marginBottom: 14 }}>{p.joinTag}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: '#f5f3ee', marginBottom: 12, letterSpacing: '-.01em' }}>{p.joinT}</div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: '#dcdbd9', margin: 0 }}>{p.joinB}</p>
              <Link href={path(loc, 'contact')} className="bh-cta" style={{ marginTop: 24, alignSelf: 'flex-start', background: '#ff4a1c', color: '#0b0b0c', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, padding: '13px 22px', borderRadius: 11 }}>
                {p.joinCta} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PLEDGE dunkel */}
      <section style={{ padding: 'clamp(56px,8vh,96px) clamp(20px,5vw,80px) clamp(60px,8vh,100px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="shield-check" size={18} />
            {p.pledgeLabel}
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(30px,4vw,52px)', fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 12px' }}>{p.pledgeT}</h2>
          <p style={{ fontSize: 18, color: '#bcbcbf', maxWidth: 680, margin: '0 0 48px', lineHeight: 1.5 }}>{p.pledgeSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18 }}>
            {p.pledge.map((pl) => (
              <div key={pl.n} className="bh-card" style={{ background: '#141417', border: '1px solid #26262a', borderRadius: 16, padding: '28px 30px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 17, fontWeight: 700, color: '#ffd23f', flex: 'none', width: 30, lineHeight: 1.3 }}>{pl.n}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                    <Icon name={pl.icon} size={19} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600 }}>{pl.t}</span>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.5, color: '#dcdbd9', margin: 0 }}>{pl.b}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href={path(loc, 'useCases')} className="bh-cta" style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
              {dict.home.teaser.ucRead} &rarr;
            </Link>
            <Link href={path(loc, 'contact')} className="bh-cta" style={{ border: '1px solid #3a3a40', color: '#f5f3ee', fontWeight: 600, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
              {dict.home.final.cta2}
            </Link>
          </div>

          <div style={{ marginTop: 40, opacity: 0.5 }} aria-hidden="true">
            <Blitz size={28} glow={false} />
          </div>
        </div>
      </section>
    </>
  );
}
