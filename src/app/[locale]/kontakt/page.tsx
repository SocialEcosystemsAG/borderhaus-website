import type { Metadata } from 'next';
import { Suspense } from 'react';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { InboundForm } from '@/components/forms/InboundForm';
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
    routeKey: 'contact',
    title: dict.pages.contact.title,
    description: dict.pages.contact.lead,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.contact, url: path(loc, 'contact') },
        ]}
      />
      <PageHero eyebrow={dict.nav.contact} title={dict.pages.contact.title} lead={dict.pages.contact.lead} />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <Suspense fallback={null}>
            <InboundForm locale={loc} dict={dict} />
          </Suspense>
          <aside className="space-y-6">
            <div className="card-light p-6">
              <h2 className="label-mono">{loc === 'de' ? 'Direkt' : 'Direct'}</h2>
              <a href={`mailto:${ORG.email}`} className="mt-2 block text-lg font-semibold hover:text-accent">
                {ORG.email}
              </a>
            </div>
            <div className="card-light p-6 text-sm text-canvas/70">
              {loc === 'de'
                ? 'Wir verarbeiten deine Angaben ausschließlich zur Bearbeitung der Anfrage.'
                : 'We process your details solely to handle your request.'}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
