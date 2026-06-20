import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { Section } from '@/components/ui/Section';
import { CtaBand } from '@/components/sections/CtaBand';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

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
    routeKey: 'impact',
    title: dict.pages.impact.title,
    description: dict.pages.impact.lead,
  });
}

export default async function ImpactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const p = dict.pages.impact;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.impact, url: path(loc, 'impact') },
        ]}
      />
      {/* Impact-Seite: dunkler Hero, Cream-Karten, dunkler Pledge (Abschnitt 3a). */}
      <section className="bg-canvas text-cream">
        <div className="container-bh py-20 sm:py-24 lg:py-28">
          <p className="label-mono mb-5 text-accent-2">{dict.nav.impact}</p>
          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{p.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-grey-300 sm:text-xl">{p.lead}</p>
        </div>
      </section>

      <Section tone="cream">
        <h2 className="text-3xl sm:text-4xl">{p.clientsHeading}</h2>
        <p className="mt-3 max-w-2xl text-canvas/70">{p.clientsNote}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-light flex h-40 flex-col justify-between p-6">
              <span className="label-mono">{loc === 'de' ? 'Kunde' : 'Customer'} {i + 1}</span>
              <span className="font-display text-lg text-canvas/40">[PH: Logo / Name]</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Dunkler Pledge als Kontrast-Anker. */}
      <section className="bg-canvas text-cream">
        <div className="container-bh py-16 sm:py-20">
          <div className="card-dark mx-auto max-w-3xl bg-panel p-10 text-center">
            <p className="label-mono text-accent-2">{loc === 'de' ? 'Selbstverpflichtung' : 'Commitment'}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">{p.pledgeHeading}</h2>
            <p className="mt-5 text-lg text-grey-300">{p.pledgeBody}</p>
          </div>
        </div>
      </section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
