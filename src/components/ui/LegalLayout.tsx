import { PageHero, CreamSection } from './PageHero';
import type { LegalDoc } from '@/config/legal';

// Layout für Rechtstexte: Hero plus strukturierte Abschnitte, optional mit
// Entwurfs-Hinweis (anwaltliche Prüfung).
export function LegalLayout({ title, doc }: { title: string; doc: LegalDoc }) {
  return (
    <>
      <PageHero title={title} maxWidth={820} />
      <CreamSection maxWidth={820} padTop="0">
        {doc.draftNotice && (
          <p
            style={{
              display: 'inline-block',
              background: 'rgba(255,74,28,.1)',
              border: '1px solid rgba(255,74,28,.35)',
              color: '#b23b1a',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            {doc.draftNotice}
          </p>
        )}

        <div style={{ maxWidth: 680 }}>
          {doc.sections.map((section, i) => (
            <section key={i} style={{ marginBottom: 28 }}>
              {section.heading && (
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, margin: '0 0 10px', color: '#0b0b0c' }}>
                  {section.heading}
                </h2>
              )}
              {section.body.map((line, j) => (
                <p key={j} style={{ fontSize: 16, lineHeight: 1.6, color: '#3a3a40', margin: '0 0 6px' }}>
                  {line}
                </p>
              ))}
            </section>
          ))}
        </div>
      </CreamSection>
    </>
  );
}
