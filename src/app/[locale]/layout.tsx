import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Space_Grotesk, Hanken_Grotesk, Space_Mono } from 'next/font/google';
import '../globals.css';
import { locales, isLocale, hreflangMap, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { SITE_URL } from '@/lib/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Analytics } from '@/components/layout/Analytics';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

const display = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
});
const body = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
});
const mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '700'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${dict.meta.name} · ${dict.meta.tagline}`, template: `%s · ${dict.meta.name}` },
    description: dict.meta.description,
    alternates: {
      languages: {
        'de-DE': '/de',
        en: '/en',
        'x-default': '/de',
      },
    },
    openGraph: {
      type: 'website',
      siteName: dict.meta.name,
      locale: hreflangMap[loc],
      title: `${dict.meta.name} · ${dict.meta.tagline}`,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={hreflangMap[locale]} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-cream"
        >
          {locale === 'de' ? 'Zum Inhalt springen' : 'Skip to content'}
        </a>
        <OrganizationJsonLd locale={locale} />
        <Header locale={locale} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <CookieBanner dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
