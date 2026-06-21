import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { InboundForm } from '@/components/forms/InboundForm';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'contact', title: dict.pages.contact.title, description: dict.pages.contact.lead });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.contact;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.contact, url: path(loc, 'contact') },
        ]}
      />
      <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(48px,7vh,90px) clamp(20px,5vw,80px)' }}>
        <div className="bh-contact" style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 18 }}>{p.label}</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,4.4vw,56px)', fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 18px', lineHeight: 1 }}>{p.title}</h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: '#3a3a40', margin: '0 0 30px' }}>{p.lead}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {p.points.map((cp) => (
                <div key={cp.n} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#ff4a1c', letterSpacing: '.1em', flex: 'none', width: 22 }}>{cp.n}</span>
                  <span style={{ fontSize: 16, color: '#3a3a40' }}>{cp.t}</span>
                </div>
              ))}
            </div>
            <Link href={path(loc, 'book')} className="bh-cta" style={{ display: 'inline-flex', marginTop: 28, border: '1px solid #c9c4ba', color: '#0b0b0c', fontWeight: 600, fontSize: 16, padding: '13px 24px', borderRadius: 9 }}>
              {dict.nav.book} &rarr;
            </Link>
          </div>

          <Suspense fallback={null}>
            <InboundForm locale={loc} dict={dict} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
