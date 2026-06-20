import type { Metadata } from 'next';
import Link from 'next/link';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { pageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { getArticles } from '@/lib/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  return pageMetadata({
    locale: loc,
    routeKey: 'knowledge',
    title: dict.pages.knowledge.title,
    description: dict.pages.knowledge.lead,
  });
}

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'de';
  const dict = getDictionary(loc);
  const articles = await getArticles(loc);

  return (
    <>
      <Breadcrumb
        items={[
          { name: dict.meta.name, url: path(loc, 'home') },
          { name: dict.nav.knowledge, url: path(loc, 'knowledge') },
        ]}
      />
      <PageHero eyebrow={dict.nav.knowledge} title={dict.pages.knowledge.title} lead={dict.pages.knowledge.lead} />

      <Section tone="white">
        {articles.length === 0 ? (
          <div className="card-light p-10 text-center text-canvas/60">{dict.pages.knowledge.empty}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`${path(loc, 'knowledge')}/${article.slug}`}
                className="card-light flex flex-col p-7 transition-shadow hover:shadow-lg"
              >
                {article.type && <span className="label-mono text-accent">{article.type}</span>}
                <h2 className="mt-3 text-xl font-semibold">{article.title}</h2>
                {article.excerpt && <p className="mt-2 text-canvas/70">{article.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
