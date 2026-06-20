import { clsx } from '@/lib/clsx';

// Sektions-Hintergruende nach Abschnitt 3a. "cream"/"white" sind hell (Default),
// "dark" nur als gezielter Kontrast-Anker (Proof, CTA, starke Feature-Karten).
type Tone = 'cream' | 'white' | 'dark';

const toneClass: Record<Tone, string> = {
  cream: 'bg-cream text-canvas',
  white: 'bg-white text-canvas',
  dark: 'bg-canvas text-cream',
};

export function Section({
  tone = 'cream',
  className,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={clsx(toneClass[tone], 'py-16 sm:py-20 lg:py-24', className)}>
      <div className="container-bh">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx('label-mono mb-3', className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'light',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}) {
  return (
    <div className={clsx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">{title}</h2>
      {intro && (
        <p className={clsx('mt-4 text-lg', tone === 'dark' ? 'text-grey-300' : 'text-canvas/70')}>
          {intro}
        </p>
      )}
    </div>
  );
}
