import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { routes } from '@/i18n/routes';
import { SITE_URL } from '@/lib/site';
import { getArticles } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const segment of Object.values(routes)) {
      const url = segment ? `${SITE_URL}/${locale}/${segment}` : `${SITE_URL}/${locale}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: segment === '' ? 'weekly' : 'monthly',
        priority: segment === '' ? 1 : 0.7,
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
