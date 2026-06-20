import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { SectionHeading } from '@/components/ui/Section';

// "So funktioniert es" hell, Dual-Prinzip als dunkle Feature-Karte auf hellem
// Sektionshintergrund (Abschnitt 3a, Regel 4).
export function HowItWorks({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.howItWorks;
  return (
    <section className="bg-cream text-canvas">
      <div className="container-bh py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={h.eyebrow} title={h.heading} intro={h.intro} />

        {/* Starkes Diagramm bleibt dunkel und stark, Hintergrund ist hell. */}
        <div className="card-dark mt-12 overflow-hidden">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {h.principle.steps.map((step, i) => (
              <div key={step.title} className="bg-panel p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-cream">
                    {i + 1}
                  </span>
                  <span className="label-mono text-accent-2">{step.label}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-cream">{step.title}</h3>
                <p className="mt-2 text-sm text-grey-300">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-4 border-t border-border p-8 sm:flex-row sm:items-center">
            <p className="font-display text-lg text-cream">{h.principle.title}</p>
            <Link href={path(locale, 'howItWorks')} className="btn-on-dark">
              {h.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
