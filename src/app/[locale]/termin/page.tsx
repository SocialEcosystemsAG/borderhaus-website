import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BookACall } from '@/components/forms/BookACall';
import { BOOKING_URL } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({ locale: loc, routeKey: 'book', title: dict.bookPage.title, description: dict.bookPage.lead });
}

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.book, url: path(loc, 'book') },
        ]}
      />
      <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(48px,7vh,90px) clamp(20px,5vw,80px)' }}>
        <BookACall locale={loc} dict={dict} bookingUrl={BOOKING_URL} />
      </section>
    </>
  );
}
