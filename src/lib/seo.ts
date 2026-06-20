import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { hreflangMap } from '@/i18n/config';
import { path, type RouteKey } from '@/i18n/routes';
import { routes } from '@/i18n/routes';

// Baut Metadata inkl. Canonical und hreflang-Alternates fuer eine Seite.
export function pageMetadata({
  locale,
  routeKey,
  title,
  description,
}: {
  locale: Locale;
  routeKey: RouteKey;
  title: string;
  description?: string;
}): Metadata {
  const segment = routes[routeKey];
  const canonical = path(locale, routeKey);
  const deHref = segment ? `/de/${segment}` : '/de';
  const enHref = segment ? `/en/${segment}` : '/en';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        'de-DE': deHref,
        en: enHref,
        'x-default': deHref,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: hreflangMap[locale],
    },
  };
}
