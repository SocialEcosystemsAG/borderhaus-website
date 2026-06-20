// Inner-Page-Hero exakt nach Borderhaus_Homepage_v2.html: hell auf Cream,
// Mono-Eyebrow, große Space-Grotesk-Headline, Lead.
export function PageHero({
  eyebrow,
  title,
  lead,
  maxWidth = 1180,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  maxWidth?: number;
}) {
  return (
    <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(48px,7vh,84px) clamp(20px,5vw,80px) clamp(28px,4vh,44px)' }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        {eyebrow && (
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 18 }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px,5vw,68px)', fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 18px', lineHeight: 1 }}>
          {title}
        </h1>
        {lead && <p style={{ fontSize: 19, lineHeight: 1.55, color: '#3a3a40', maxWidth: 640, margin: 0 }}>{lead}</p>}
      </div>
    </section>
  );
}

// Content-Sektion auf Cream mit passender Innenbreite.
export function CreamSection({
  children,
  maxWidth = 1180,
  padTop = 'clamp(8px,2vh,20px)',
}: {
  children: React.ReactNode;
  maxWidth?: number;
  padTop?: string;
}) {
  return (
    <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: `${padTop} clamp(20px,5vw,80px) clamp(48px,7vh,84px)` }}>
      <div style={{ maxWidth, margin: '0 auto' }}>{children}</div>
    </section>
  );
}
