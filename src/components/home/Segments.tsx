import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { SectionHeading } from '@/components/ui/Section';

// Hell. Karten in reinem Weiss als Erhebung auf Cream (Abschnitt 3a, Regel 5).
export function Segments({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const s = dict.home.segments;
  return (
    <section className="bg-cream text-canvas">
      <div className="container-bh py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={s.eyebrow} title={s.heading} intro={s.intro} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {s.items.map((item) => (
            <div key={item.title} className="card-light p-7 transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-canvas/70">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link href={path(locale, 'whoFor')} className="btn-secondary">
            {dict.cta.learnMore}
          </Link>
        </div>
      </div>
    </section>
  );
}
