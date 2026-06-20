import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero, CreamSection } from '@/components/ui/PageHero';
import { BreadcrumbJsonLd, LocalBusinessJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'locations', title: dict.pages.locations.title, description: dict.pages.locations.lead });
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.locations;

  return (
    <>
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.locations, url: path(loc, 'locations') },
        ]}
      />
      <PageHero eyebrow={dict.nav.locations} title={p.title} lead={p.lead} maxWidth={1100} />

      <CreamSection maxWidth={1100}>
        <div className="bh-loc">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {p.list.map((lc) => (
              <div key={lc.city} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>{lc.city}</div>
                  <div style={{ fontSize: 15, color: '#5a5a62', marginTop: 4 }}>{lc.region}</div>
                </div>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    padding: '7px 12px',
                    borderRadius: 999,
                    ...(lc.live
                      ? { background: 'rgba(255,74,28,.14)', color: '#ff7a52' }
                      : { background: '#26262a', color: '#bcbcbf' }),
                  }}
                >
                  {lc.status}
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#ff4a1c', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 16 }}>{p.catchLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {p.catch.map((c) => (
                <div key={c.code} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#ff4a1c' }}>{c.code}</span>
                  <span style={{ fontSize: 16, color: '#3a3a40' }}>{c.area}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: '#3a3a40', margin: '22px 0 0' }}>{p.catchB}</p>
          </div>
        </div>
      </CreamSection>
    </>
  );
}
