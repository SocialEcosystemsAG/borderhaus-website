import type { Dictionary } from '@/i18n';
import { Icon } from '@/components/brand/Icon';

// Proof-Sektion hell exakt aus Borderhaus_Homepage_v2.html, weiße Karten.
export function ProofBar({ dict }: { dict: Dictionary }) {
  const p = dict.home.proof;
  return (
    <section style={{ background: '#f5f3ee', color: '#0b0b0c', padding: 'clamp(52px,7vh,90px) clamp(20px,5vw,80px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: '#ff4a1c',
            marginBottom: 14,
          }}
        >
          {p.label}
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px,3.6vw,46px)',
            fontWeight: 700,
            letterSpacing: '-.02em',
            margin: '0 0 8px',
          }}
        >
          {p.heading}
        </h2>
        <p style={{ fontSize: 17, color: '#5a5a62', maxWidth: 560, margin: '0 0 36px' }}>{p.sub}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 16 }}>
          {p.points.map((pp) => (
            <div
              key={pp.k}
              className="bh-cardL"
              style={{ background: '#fff', border: '1px solid #e6e3dc', borderRadius: 14, padding: 30, boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}
            >
              <Icon name={pp.icon} size={28} />
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: '#6f6f76',
                  margin: '18px 0 8px',
                }}
              >
                {pp.k}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#0b0b0c',
                  marginBottom: 8,
                  letterSpacing: '-.01em',
                }}
              >
                {pp.t}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.5, color: '#3a3a40', margin: 0 }}>{pp.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
