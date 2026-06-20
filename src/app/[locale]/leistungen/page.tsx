import type { Metadata } from 'next';
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
  return pageMetadata({ locale: loc, routeKey: 'services', title: dict.pages.services.title, description: dict.pages.services.lead });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.services;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.services, url: path(loc, 'services') },
        ]}
      />
      <PageHero eyebrow={dict.nav.services} title={p.title} lead={p.lead} />

      <CreamSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {p.items.map((sv) => (
            <div key={sv.k} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 32, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#ff4a1c', letterSpacing: '.14em', textTransform: 'uppercase' }}>{sv.k}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, margin: '12px 0 10px' }}>{sv.t}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: '#3a3a40', margin: '0 0 12px' }}>{sv.b}</p>
              <div style={{ fontSize: 14, color: '#6f6f76', borderTop: '1px solid #ece9e1', paddingTop: 12 }}>{sv.d}</div>
            </div>
          ))}
        </div>
      </CreamSection>
    </>
  );
}
