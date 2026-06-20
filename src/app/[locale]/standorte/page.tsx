import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { CtaBand } from '@/components/sections/CtaBand';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';
import { ORG } from '@/lib/site';

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
    routeKey: 'locations',
    title: dict.pages.locations.title,
    description: dict.pages.locations.lead,
  });
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <LocalBusinessJsonLd />
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.locations, url: path(loc, 'locations') },
        ]}
      />
      <PageHero eyebrow={dict.nav.locations} title={dict.pages.locations.title} lead={dict.pages.locations.lead} />

      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-2">
          {ORG.locations.map((loc2) => (
            <div key={loc2.country} className="card-light p-7">
              <span className="label-mono text-accent">{loc2.country}</span>
              <h3 className="mt-3 text-xl font-semibold">{loc2.name}</h3>
              <address className="mt-3 not-italic text-canvas/70">
                {loc2.streetAddress}
                <br />
                {loc2.postalCode} {loc2.city}
                <br />
                {loc2.addressCountry}
              </address>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
