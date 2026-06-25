import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { routes, legalSlugs, type LegalKey } from '@/i18n/routes';
import { SITE_URL } from '@/lib/site';
import { getArticles } from '@/lib/sanity';

// Rechtsseiten haben pro Sprache eigene Slugs, daher separat behandelt.
const LEGAL_KEYS: LegalKey[] = ['imprint', 'privacy', 'terms'];
const LEGAL_SEGMENTS = new Set<string>(['impressum', 'datenschutz', 'agb']);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const segment of Object.values(routes)) {
      // Legal-Slugs ueberspringen, weiter unten pro Sprache korrekt eintragen.
      if (LEGAL_SEGMENTS.has(segment)) continue;
      const url = segment ? `${SITE_URL}/${locale}/${segment}` : `${SITE_URL}/${locale}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: segment === '' ? 'weekly' : 'monthly',
        priority: segment === '' ? 1 : 0.7,
      });
    }

    // Rechtsseiten mit dem korrekten Slug der jeweiligen Sprache.
    for (const key of LEGAL_KEYS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${legalSlugs[key][locale]}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      });
    }

    // Wissensartikel aus Sanity (falls konfiguriert).
    const articles = await getArticles(locale);
    for (const article of articles) {
      entries.push({
        url: `${SITE_URL}/${locale}/${routes.knowledge}/${article.slug}`,
        lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
