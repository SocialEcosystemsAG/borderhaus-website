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
    routeKey: 'integrations',
    title: dict.pages.integrations.title,
    description: dict.pages.integrations.lead,
  });
}

export default async function IntegrationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.integrations, url: path(loc, 'integrations') },
        ]}
      />
      <PageHero
        eyebrow={dict.nav.integrations}
        title={dict.pages.integrations.title}
        lead={dict.pages.integrations.lead}
      />

      <Section tone="white">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dict.home.integrations.logos.map((logo) => (
            <div key={logo} className="card-light flex items-center justify-between p-6">
              <span className="font-display text-lg font-semibold">{logo}</span>
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-canvas/60">
          [PH: Detail-Anleitungen je Integration folgen. REST-API-Dokumentation von Marcel.]
        </p>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
