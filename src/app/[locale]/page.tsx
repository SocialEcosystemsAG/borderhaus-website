import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Hero } from '@/components/home/Hero';
import { ProofBar } from '@/components/home/ProofBar';
import { CalcTeaser, IntegrationsStrip, TeaserRow, FinalCta } from '@/components/home/HomeSections';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';

// Homepage exakt nach Borderhaus_Homepage_v2.html:
// dunkler Hero (Haus-Blitz rechts) -> Proof hell -> Calc-Teaser -> Integrationen
// -> Impact/UseCase/KB-Teaser -> Final-CTA dunkel.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <LocalBusinessJsonLd />
      <Hero locale={loc} dict={dict} />
      <ProofBar dict={dict} />
      <CalcTeaser locale={loc} dict={dict} />
      <IntegrationsStrip locale={loc} dict={dict} />
      <TeaserRow locale={loc} dict={dict} />
      <FinalCta locale={loc} dict={dict} />
    </>
  );
}
