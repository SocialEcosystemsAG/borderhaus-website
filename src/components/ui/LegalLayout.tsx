import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';

// Schlichtes Layout fuer Rechtstexte. Inhalt liefert Marcel.
export function LegalLayout({ title, lead }: { title: string; lead: string }) {
  return (
    <>
      <PageHero title={title} />
      <Section tone="white">
        <div className="prose-bh max-w-2xl space-y-4 text-canvas/80">
          <p>{lead}</p>
        </div>
      </Section>
    </>
  );
}
