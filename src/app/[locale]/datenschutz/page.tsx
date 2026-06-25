import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
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
  const alt = legalAlternates('privacy');
  return {
    title: dict.pages.privacy.title,
    alternates: { canonical: alt.canonicalDe, languages: alt.languages },
  };
}

export default async function PrivacyDePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'de') notFound();
  const dict = getDictionary('de');
  return <LegalLayout title={dict.pages.privacy.title} doc={legal.de.privacy} />;
}
