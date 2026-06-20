import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { CtaBand } from '@/components/sections/CtaBand';
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
    routeKey: 'about',
    title: dict.pages.about.title,
    description: dict.pages.about.lead,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.about, url: path(loc, 'about') },
        ]}
      />
      <PageHero eyebrow={dict.nav.about} title={dict.pages.about.title} lead={dict.pages.about.lead} />

      <Section tone="white">
        <div className="max-w-2xl space-y-4 text-lg text-canvas/80">
          <p>
            {loc === 'de'
              ? `${dict.meta.name} ist eine eigenstaendige Marke der ${ORG.legalName}.`
              : `${dict.meta.name} is an independent brand of ${ORG.legalName}.`}
          </p>
          <p className="text-base text-canvas/60">
            [PH: {loc === 'de' ? 'Team, Geschichte und Mission von Marcel' : 'team, story and mission from Marcel'}.]
          </p>
        </div>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
