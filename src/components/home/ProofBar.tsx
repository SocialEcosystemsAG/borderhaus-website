import type { Dictionary } from '@/i18n';

// Proof-Leiste dunkel: sechs Punkte mit Icon, Mono-Label, grosser Headline und
// Satz. Ueberschrift mit Keyword (Abschnitt 3a).
const ICONS = ['M3 12h18M12 3v18', 'M5 13l4 4L19 7', 'M13 2L3 14h7l-1 8 10-12h-7z', 'M4 7h16M4 12h16M4 17h10', 'M12 21s-7-4.5-7-10a7 7 0 0114 0c0 5.5-7 10-7 10z', 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16l-4.9 2.6.9-5.5-4-3.9 5.5-.8z'];

export function ProofBar({ dict }: { dict: Dictionary }) {
  const p = dict.home.proof;
  return (
    <section className="bg-canvas text-cream">
      <div className="container-bh py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="label-mono mb-3">Borderhaus</p>
          <h2 className="text-3xl sm:text-4xl">{p.heading}</h2>
          <p className="mt-4 text-lg text-grey-300">{p.intro}</p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {p.points.map((point, i) => (
            <li key={point.label} className="bg-panel p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-panel-2 text-accent">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d={ICONS[i % ICONS.length]}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="label-mono mt-5 text-accent-2">{point.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{point.headline}</p>
              <p className="mt-2 text-sm text-grey-300">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
