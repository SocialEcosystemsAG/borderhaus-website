// Wortmarke als Platzhalter. [PH: finales SVG-Logo von Claude Design einsetzen.]
export function Logo({ className = '', onDark = true }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={`font-display text-xl font-bold tracking-tight ${
        onDark ? 'text-cream' : 'text-canvas'
      } ${className}`}
      aria-label="Borderhaus"
    >
      border<span className="text-accent">haus</span>
    </span>
  );
}
