import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { SectionHeading } from '@/components/ui/Section';

// Hell mit weissen Logo-Chips. Orange als Akzent.
export function IntegrationsTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const it = dict.home.integrations;
  return (
    <section className="bg-white text-canvas">
      <div className="container-bh py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={it.eyebrow} title={it.heading} intro={it.intro} />
        <ul className="mt-10 flex flex-wrap gap-3">
          {it.logos.map((logo) => (
            <li
              key={logo}
              className="rounded-full border border-canvas/15 bg-cream px-5 py-2.5 font-mono text-sm"
            >
              {logo}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link href={path(locale, 'integrations')} className="btn-secondary">
            {dict.cta.learnMore}
          </Link>
        </div>
      </div>
    </section>
  );
}
