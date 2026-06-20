import type { Metadata } from 'next';
import Image from 'next/image';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero, CreamSection } from '@/components/ui/PageHero';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { INTEGRATIONS } from '@/config/integrations';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'integrations', title: dict.pages.integrations.title, description: dict.pages.integrations.lead });
}

export default async function IntegrationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.integrations;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.integrations, url: path(loc, 'integrations') },
        ]}
      />
      <PageHero eyebrow={dict.nav.integrations} title={p.title} lead={p.lead} maxWidth={1100} />

      <CreamSection maxWidth={1100}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {INTEGRATIONS.map((ig) => (
            <div key={ig.name} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
              <div style={{ background: '#0b0b0c', borderRadius: 10, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px' }}>
                <Image src={ig.logo} alt={ig.name} width={120} height={30} loading="eager" style={{ maxHeight: 30, maxWidth: '78%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.5, color: '#3a3a40', margin: 0 }}>{ig.desc[loc]}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 28, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#ff4a1c', letterSpacing: '.14em', textTransform: 'uppercase', flex: 'none' }}>REST-API</div>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: '#3a3a40', margin: 0 }}>{p.api}</p>
        </div>
      </CreamSection>
    </>
  );
}
