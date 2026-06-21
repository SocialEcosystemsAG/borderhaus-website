import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero, CreamSection } from '@/components/ui/PageHero';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'howItWorks', title: dict.pages.howItWorks.title, description: dict.pages.howItWorks.lead });
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.howItWorks;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.howItWorks, url: path(loc, 'howItWorks') },
        ]}
      />
      <PageHero eyebrow={dict.nav.howItWorks} title={p.title} lead={p.lead} maxWidth={1100} />

      <CreamSection maxWidth={1100}>
        <div className="bh-grid-4" style={{ marginBottom: 24 }}>
          {p.steps.map((st) => (
            <div key={st.n} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 26, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 30, fontWeight: 700, color: '#ff4a1c' }}>{st.n}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, margin: '14px 0 8px' }}>{st.t}</div>
              <p style={{ fontSize: 15, lineHeight: 1.5, color: '#5a5a62', margin: 0 }}>{st.b}</p>
            </div>
          ))}
        </div>

        {/* Dual-Domestic als dunkle Feature-Karte. */}
        <div style={{ background: '#141417', border: '1px solid #26262a', borderRadius: 16, padding: 'clamp(28px,4vw,48px)' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px,2.6vw,34px)', fontWeight: 700, margin: '0 0 26px', color: '#f5f3ee' }}>{p.dualT}</h2>
          <div className="bh-dual">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 48, fontWeight: 700, color: '#f5f3ee' }}>NL</div>
              <div style={{ fontSize: 14, color: '#7d7d84', marginTop: 6 }}>{p.dualNL}</div>
            </div>
            <div style={{ position: 'relative', width: 70, height: 140, margin: '0 auto' }}>
              <svg viewBox="0 0 80 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path d="M48 6 L18 78 L37 72 L29 164 L64 74 L43 80 L58 6 Z" fill="#ff4a1c" className="bh-flash" style={{ filter: 'drop-shadow(0 0 8px rgba(255,74,28,.7))' }} />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 48, fontWeight: 700, color: '#f5f3ee' }}>DE</div>
              <div style={{ fontSize: 14, color: '#7d7d84', marginTop: 6 }}>{p.dualDE}</div>
            </div>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: '#dcdbd9', textAlign: 'center', maxWidth: 620, margin: '26px auto 0' }}>{p.dualB}</p>
        </div>

        {/* CTAs (Runde 2) */}
        <div style={{ marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href={path(loc, 'pricing')} className="bh-cta" style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
            {dict.cta.startCalc}
          </Link>
          <Link href={path(loc, 'book')} className="bh-cta" style={{ border: '1px solid #c9c4ba', color: '#0b0b0c', fontWeight: 600, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
            {dict.nav.book}
          </Link>
        </div>
      </CreamSection>

      {/* Abschluss-CTA dunkel */}
      <section style={{ padding: 'clamp(40px,6vh,72px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(180deg,#141417,#0e0e10)', border: '1px solid #26262a', borderRadius: 18, padding: 'clamp(32px,5vw,56px)' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(26px,3.4vw,40px)', fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 14px', color: '#f5f3ee' }}>{dict.home.final.t}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: '#dcdbd9', maxWidth: 540, margin: '0 auto 26px' }}>{dict.home.final.b}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={path(loc, 'pricing')} className="bh-cta" style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: '14px 28px', borderRadius: 10 }}>
              {dict.cta.startCalc}
            </Link>
            <Link href={path(loc, 'book')} className="bh-cta" style={{ border: '1px solid #3a3a40', color: '#f5f3ee', fontWeight: 600, fontSize: 16, padding: '14px 28px', borderRadius: 10 }}>
              {dict.nav.book}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
