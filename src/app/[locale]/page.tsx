import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Hero } from '@/components/home/Hero';
import { ProofBar } from '@/components/home/ProofBar';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Segments } from '@/components/home/Segments';
import { IntegrationsTeaser } from '@/components/home/IntegrationsTeaser';
import { CtaBand } from '@/components/sections/CtaBand';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <LocalBusinessJsonLd />
      {/* Header schwarz (Layout). Hero hell, dann gezielte dunkle Anker. */}
      <Hero locale={loc} dict={dict} />
      <ProofBar dict={dict} />
      <HowItWorks locale={loc} dict={dict} />
      <Segments locale={loc} dict={dict} />
      <IntegrationsTeaser locale={loc} dict={dict} />
      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
