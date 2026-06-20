import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'useCases', title: dict.pages.useCases.detailT, description: dict.pages.useCases.lead });
}

export default async function UseCasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.useCases;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.useCases, url: path(loc, 'useCases') },
        ]}
      />

      <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(48px,7vh,84px) clamp(20px,5vw,80px) clamp(20px,3vh,32px)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 18 }}>
            {p.label} &middot; {p.branche}
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,4.4vw,58px)', fontWeight: 700, letterSpacing: '-.03em', margin: 0, lineHeight: 1.02 }}>{p.detailT}</h1>
        </div>
      </section>

      <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(40px,6vh,72px) clamp(20px,5vw,80px) clamp(56px,8vh,90px)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
            {p.kpis.map((kpi) => (
              <div key={kpi.l} style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 12, padding: '18px 22px', boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: '#ff4a1c' }}>{kpi.v}</div>
                <div style={{ fontSize: 13, color: '#6f6f76', marginTop: 4 }}>{kpi.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            {p.sections.map((s, i) =>
              i === p.sections.length - 1 ? (
                <div key={s.t} style={{ background: '#fff', border: '1px solid #e6e3dc', borderLeft: '3px solid #ff4a1c', borderRadius: 12, padding: 28, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, margin: '0 0 10px' }}>{s.t}</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.6, color: '#3a3a40', margin: 0 }}>{s.b}</p>
                </div>
              ) : (
                <div key={s.t}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, margin: '0 0 10px', color: '#ff4a1c' }}>{s.t}</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.6, color: '#3a3a40', margin: 0 }}>{s.b}</p>
                </div>
              ),
            )}
          </div>

          <div style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href={path(loc, 'pricing')} className="bh-cta" style={{ background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
              {dict.home.hero.cta1}
            </Link>
            <Link href={path(loc, 'contact')} className="bh-cta" style={{ border: '1px solid #c9c4ba', color: '#0b0b0c', fontWeight: 600, fontSize: 16, padding: '14px 26px', borderRadius: 9 }}>
              {dict.home.final.cta2}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
