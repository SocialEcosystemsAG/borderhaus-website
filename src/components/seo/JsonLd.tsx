import type { Locale } from '@/i18n/config';
import { SITE_URL, ORG } from '@/lib/site';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Strukturierte Daten. Inhalt ist statisch/serverseitig, kein User-Input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: ORG.brand,
        legalName: ORG.legalName,
        url: `${SITE_URL}/${locale}`,
        email: ORG.email,
        parentOrganization: { '@type': 'Organization', name: ORG.legalName },
        sameAs: [],
      }}
    />
  );
}

// Je Standort eine LocalBusiness (Dual-Domestic: DE und NL).
export function LocalBusinessJsonLd() {
  return (
    <>
      {ORG.locations.map((loc) => (
        <JsonLd
          key={loc.country}
          data={{
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: loc.name,
            parentOrganization: { '@type': 'Organization', name: ORG.brand },
            address: {
              '@type': 'PostalAddress',
              streetAddress: loc.streetAddress,
              postalCode: loc.postalCode,
              addressLocality: loc.city,
              addressCountry: loc.addressCountry,
            },
            email: ORG.email,
          }}
        />
      ))}
    </>
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  if (!items.length) return null;
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        mainEntityOfPage: url.startsWith('http') ? url : `${SITE_URL}${url}`,
        author: { '@type': 'Organization', name: ORG.brand },
        publisher: { '@type': 'Organization', name: ORG.legalName },
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
      }}
    />
  );
}
