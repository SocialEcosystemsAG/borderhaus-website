import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { legalAlternates } from '@/i18n/routes';
import { LegalLayout } from '@/components/ui/LegalLayout';
import { legal } from '@/config/legal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'de');
  const alt = legalAlternates('imprint');
  return {
    title: dict.pages.imprint.title,
    alternates: { canonical: alt.canonicalDe, languages: alt.languages },
  };
}

export default async function ImprintDePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Deutsche Rechtsseite nur unter /de.
  if (locale !== 'de') notFound();
  const dict = getDictionary('de' as Locale);
  return <LegalLayout title={dict.pages.imprint.title} doc={legal.de.imprint} />;
}
