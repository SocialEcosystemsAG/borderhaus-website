import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';

// Hero hell (Cream), direkter Catch, Claim mit Orange-Pointe, Trust-Chips inkl.
// EU-Bio (Abschnitt 3a).
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;
  return (
    <section className="relative overflow-hidden bg-cream text-canvas">
      <div className="container-bh py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <p className="label-mono mb-5">{h.eyebrow}</p>
          <h1 className="text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
            {h.title}
            <br />
            <span className="text-accent">{h.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-canvas/70 sm:text-xl">{h.subtitle}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={path(locale, 'pricing')} className="btn-primary">
              {dict.cta.calculate}
            </Link>
            <Link href={path(locale, 'howItWorks')} className="btn-secondary">
              {dict.cta.learnMore}
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {h.trust.map((chip) => (
              <li key={chip} className="flex items-center gap-2 text-sm font-medium text-canvas/80">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
