import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero, CreamSection } from '@/components/ui/PageHero';
import { PriceCalculator } from '@/components/calculator/PriceCalculator';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'pricing', title: dict.pages.pricing.title, description: dict.pages.pricing.lead });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.pricing, url: path(loc, 'pricing') },
        ]}
      />
      <PageHero eyebrow={dict.nav.pricing} title={dict.pages.pricing.title} lead={dict.pages.pricing.lead} maxWidth={1160} />
      <CreamSection maxWidth={1160} padTop="0">
        <PriceCalculator locale={loc} dict={dict} />
      </CreamSection>
    </>
  );
}
