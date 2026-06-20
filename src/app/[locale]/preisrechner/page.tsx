import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { PriceCalculator } from '@/components/calculator/PriceCalculator';

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
    routeKey: 'pricing',
    title: dict.pages.pricing.title,
    description: dict.pages.pricing.lead,
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.pricing, url: path(loc, 'pricing') },
        ]}
      />
      <PageHero eyebrow={dict.nav.pricing} title={dict.pages.pricing.title} lead={dict.pages.pricing.lead} />

      <Section tone="white">
        <PriceCalculator locale={loc} dict={dict} />
        <p className="mt-8 max-w-2xl text-sm text-canvas/60">{dict.pages.pricing.disclaimer}</p>
      </Section>
    </>
  );
}
