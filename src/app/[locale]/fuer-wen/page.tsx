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
    routeKey: 'whoFor',
    title: dict.pages.whoFor.title,
    description: dict.pages.whoFor.lead,
  });
}

export default async function WhoForPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.whoFor, url: path(loc, 'whoFor') },
        ]}
      />
      <PageHero eyebrow={dict.nav.whoFor} title={dict.pages.whoFor.title} lead={dict.pages.whoFor.lead} />

      <Section tone="white">
        <div className="grid gap-6 md:grid-cols-3">
          {dict.home.segments.items.map((item) => (
            <div key={item.title} className="card-light p-7">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-canvas/70">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand locale={loc} dict={dict} />
    </>
  );
}
