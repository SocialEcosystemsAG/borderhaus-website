import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { ArticleJsonLd, FaqJsonLd } from '@/components/seo/JsonLd';
import { getArticle } from '@/lib/sanity';
import { PortableText } from '@/components/knowledge/PortableText';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const article = await getArticle(loc, slug);
  if (!article) return {};
  const url = `${path(loc, 'knowledge')}/${slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const article = await getArticle(loc, slug);
  if (!article) notFound();

  const url = `${path(loc, 'knowledge')}/${slug}`;

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt ?? ''}
        url={url}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
      />
      {article.faq && article.faq.length > 0 && <FaqJsonLd items={article.faq} />}

      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.knowledge, url: path(loc, 'knowledge') },
          { name: article.title, url },
        ]}
      />
      <PageHero eyebrow={article.type ?? dict.nav.knowledge} title={article.title} lead={article.excerpt} />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <article className="max-w-2xl">
            <PortableText value={article.body} />

            {article.faq && article.faq.length > 0 && (
              <div className="mt-12 space-y-4">
                <h2 className="text-2xl font-semibold">FAQ</h2>
                {article.faq.map((item, i) => (
                  <details key={i} className="card-light p-5">
                    <summary className="cursor-pointer font-semibold">{item.question}</summary>
                    <p className="mt-2 text-canvas/70">{item.answer}</p>
                  </details>
                ))}
              </div>
            )}
          </article>

          {article.related && article.related.length > 0 && (
            <aside className="space-y-3">
              <h2 className="label-mono">{loc === 'de' ? 'Verwandt' : 'Related'}</h2>
              {article.related.map((rel) => (
                <Link
                  key={rel._id}
                  href={`${path(loc, 'knowledge')}/${rel.slug}`}
                  className="card-light block p-4 text-sm hover:shadow-md"
                >
                  {rel.title}
                </Link>
              ))}
            </aside>
          )}
        </div>
      </Section>
    </>
  );
}
