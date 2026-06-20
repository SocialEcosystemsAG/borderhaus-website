import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section, SectionHeading } from '@/components/ui/Section';
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
    routeKey: 'howItWorks',
    title: dict.pages.howItWorks.title,
    description: dict.pages.howItWorks.lead,
  });
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const h = dict.home.howItWorks;

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.howItWorks, url: path(loc, 'howItWorks') },
        ]}
      />
      <PageHero
        eyebrow={dict.pages.howItWorks.title}
        title={dict.pages.howItWorks.title}
        lead={dict.pages.howItWorks.lead}
      />

      <Section tone="white">
        <SectionHeading eyebrow={h.eyebrow} title={h.principle.title} intro={h.intro} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {h.principle.steps.map((step, i) => (
            <div key={step.title} className="card-light p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-cream">
                {i + 1}
              </span>
              <p className="label-mono mt-5">{step.label}</p>
              <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-canvas/70">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
