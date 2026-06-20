import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { CtaBand } from '@/components/sections/CtaBand';

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
    routeKey: 'services',
    title: dict.pages.services.title,
    description: dict.pages.services.lead,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.services;

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.services, url: path(loc, 'services') },
        ]}
      />
      <PageHero eyebrow={dict.nav.services} title={p.title} lead={p.lead} />

      <Section tone="white">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {p.items.map((item, i) => (
            <div key={item.title} className="card-light p-7">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-canvas/70">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
