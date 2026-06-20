// Winziger Klassen-Helfer, spart eine Dependency.
export function clsx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
