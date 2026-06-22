import type { Metadata } from 'next';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero, CreamSection } from '@/components/ui/PageHero';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { PLATFORMS } from '@/config/integrations';
import { publicAsset } from '@/lib/assets';

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
      <PageHero eyebrow={dict.nav.integrations} title={p.title} lead={p.lead} maxWidth={1180} />

      <CreamSection maxWidth={1180}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18 }}>
          {PLATFORMS.map((pf) => (
            <div key={pf.name} className="bh-cardL" style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
              {/* Logo-Kachel oder Text-Fallback */}
              <div style={{ background: '#0b0b0c', borderRadius: 10, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', marginBottom: 18 }}>
                {pf.logo && publicAsset(pf.logo) ? (
                  <Image src={pf.logo} alt={pf.name} width={120} height={28} loading="eager" style={{ maxHeight: 28, maxWidth: '70%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#f5f3ee' }}>{pf.name}</span>
                )}
              </div>

              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>{pf.name}</h2>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6f6f76', marginBottom: 18 }}>{pf.category[loc]}</div>

              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1f8f4e', marginBottom: 8 }}>{p.proLabel}</div>
              <ul style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {pf.pros[loc].map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 9, fontSize: 15, lineHeight: 1.45, color: '#3a3a40' }}>
                    <Check size={17} style={{ color: '#1f8f4e', flex: 'none', marginTop: 2 }} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#b23b1a', marginBottom: 8 }}>{p.conLabel}</div>
              <ul style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {pf.cons[loc].map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 9, fontSize: 15, lineHeight: 1.45, color: '#3a3a40' }}>
                    <X size={17} style={{ color: '#b23b1a', flex: 'none', marginTop: 2 }} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #ece9e1', paddingTop: 14, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6f6f76' }}>{p.timeLabel}</span>
                <span style={{ fontSize: 14, color: '#ff4a1c', fontWeight: 600, textAlign: 'right' }}>{pf.time[loc]}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 24, fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px,2vw,22px)', fontWeight: 600, color: '#0b0b0c' }}>{p.closing}</p>
      </CreamSection>
    </>
  );
}
