// Marken-SVGs, Pfade exakt aus Borderhaus_Homepage_v2.html.

// Kleiner Blitz in der Wortmarke "border[blitz]haus".
export function WordmarkBlitz({ width = 15, height = 30 }: { width?: number; height?: number }) {
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', width, height, margin: '0 1px' }}
    >
      <svg viewBox="0 0 80 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path d="M48 6 L18 78 L37 72 L29 164 L64 74 L43 80 L58 6 Z" fill="#ff4a1c" />
      </svg>
    </span>
  );
}

// Wortmarke border + Blitz + haus (haus in Orange, wie Homepage-Vorlage).
export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: size,
        fontWeight: 700,
        letterSpacing: '-.02em',
      }}
    >
      border
      <WordmarkBlitz width={size * 0.58} height={size * 1.15} />
      <span style={{ color: '#ff4a1c' }}>haus</span>
    </span>
  );
}

// Hero-Haus-Blitz-Motiv: zwei Haushälften, die sich teilen, plus pulsierender Blitz.
export function HeroHausMotif() {
  return (
    <div style={{ position: 'relative', width: 'min(360px,70vw)', height: 'min(340px,66vw)' }}>
      <svg
        viewBox="0 0 120 120"
        className="bh-split-l"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M16 46 L60 14 L60 106 L16 106 Z"
          fill="#141417"
          stroke="#f5f3ee"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 120 120"
        className="bh-split-r"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M60 14 L104 46 L104 106 L60 106 Z"
          fill="#1b1c21"
          stroke="#f5f3ee"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 120 120"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <path
          d="M66 12 L48 56 L60 53 L54 116 L74 52 L62 56 L70 12 Z"
          fill="#ff4a1c"
          className="bh-flash"
          style={{ filter: 'drop-shadow(0 0 12px rgba(255,74,28,.8))' }}
        />
      </svg>
    </div>
  );
}

// Blitz allein (Dual-Domestic-Diagramm, Erfolgsmeldung im Formular).
export function Blitz({ size = 64, glow = true }: { size?: number; glow?: boolean }) {
  return (
    <svg viewBox="0 0 80 170" style={{ width: size, height: size, overflow: 'visible' }}>
      <path
        d="M48 6 L18 78 L37 72 L29 164 L64 74 L43 80 L58 6 Z"
        fill="#ff4a1c"
        className={glow ? 'bh-flash' : undefined}
        style={glow ? { filter: 'drop-shadow(0 0 8px rgba(255,74,28,.7))' } : undefined}
      />
    </svg>
  );
}
