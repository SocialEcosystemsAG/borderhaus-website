// Leichtgewichtiger Sanity-Client ueber die HTTP-API (GROQ), ohne extra
// Dependency. Ist Sanity nicht konfiguriert, liefern die Funktionen leere
// Ergebnisse, damit Build und Seite ohne CMS funktionieren.
import type { Locale } from '@/i18n/config';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export interface ArticleStub {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  type?: 'pillar' | 'cluster';
  publishedAt?: string;
}

export interface Article extends ArticleStub {
  body?: unknown;
  updatedAt?: string;
  faq?: { question: string; answer: string }[];
  related?: ArticleStub[];
}

export function isSanityConfigured(): boolean {
  return Boolean(PROJECT_ID);
}

async function query<T>(groq: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!PROJECT_ID) return null;
  const search = new URLSearchParams({ query: groq });
  Object.entries(params).forEach(([key, value]) => search.append(`$${key}`, JSON.stringify(value)));
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${search.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { result: T };
    return json.result;
  } catch {
    return null;
  }
}

export async function getArticles(locale: Locale): Promise<ArticleStub[]> {
  const groq = `*[_type == "article" && language == $lang] | order(publishedAt desc){
    _id, title, "slug": slug.current, excerpt, type, publishedAt
  }`;
  const result = await query<ArticleStub[]>(groq, { lang: locale });
  return result ?? [];
}

export async function getArticle(locale: Locale, slug: string): Promise<Article | null> {
  const groq = `*[_type == "article" && language == $lang && slug.current == $slug][0]{
    _id, title, "slug": slug.current, excerpt, type, publishedAt, updatedAt, body, faq,
    "related": related[]->{ _id, title, "slug": slug.current, excerpt, type }
  }`;
  return query<Article>(groq, { lang: locale, slug });
}
