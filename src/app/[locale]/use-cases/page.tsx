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
    routeKey: 'useCases',
    title: dict.pages.useCases.title,
    description: dict.pages.useCases.lead,
  });
}

const CASES = [
  { de: 'Launch in den Niederlanden', en: 'Launch in the Netherlands' },
  { de: 'Skalierung im Food-Segment', en: 'Scaling in the food segment' },
  { de: 'Wechsel vom Eigenversand', en: 'Switching from self-fulfilment' },
];

export default async function UseCasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.useCases, url: path(loc, 'useCases') },
        ]}
      />
      <PageHero eyebrow={dict.nav.useCases} title={dict.pages.useCases.title} lead={dict.pages.useCases.lead} />

      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <article key={i} className="card-light p-7">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-xl font-semibold">{c[loc]}</h3>
              <p className="mt-2 text-canvas/70">
                [PH: {loc === 'de' ? 'Story und Zahlen von Marcel' : 'story and numbers from Marcel'}.]
              </p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
