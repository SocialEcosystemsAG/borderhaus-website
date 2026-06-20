import { Eyebrow } from './Section';

// Jede Unterseite startet direkt unter dem schwarzen Header hell (Abschnitt 3a).
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-cream text-canvas">
      <div className="container-bh py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl lg:leading-[1.03]">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-lg text-canvas/70 sm:text-xl">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
