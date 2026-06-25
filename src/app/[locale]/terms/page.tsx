import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n';
import { legalAlternates } from '@/i18n/routes';
import { LegalLayout } from '@/components/ui/LegalLayout';
import { legal } from '@/config/legal';

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary('en');
  const alt = legalAlternates('terms');
  return {
    title: dict.pages.terms.title,
    alternates: { canonical: alt.canonicalEn, languages: alt.languages },
  };
}

export default async function TermsEnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en') notFound();
  const dict = getDictionary('en');
  return <LegalLayout title={dict.pages.terms.title} doc={legal.en.terms} />;
}
