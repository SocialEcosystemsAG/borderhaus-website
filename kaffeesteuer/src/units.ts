// Zahlenformate und exakte Rundung (Gramm/Cent statt Float-Summen).

/** kg (z. B. 0.35) -> Gramm (350), robust gegen Float-Artefakte. */
export function kgToGrams(kg: number): number {
  return Math.round(kg * 1000);
}

/** Steuer in Cent = ROUND(kg × Satz; 2), kaufmännisch gerundet. */
export function taxCents(grams: number, rateCentsPerKg: number): number {
  // grams * cents/kg / 1000 = cents; ganzzahlig rechnen, dann half-up runden
  const numerator = grams * rateCentsPerKg; // Einheit: Cent/1000
  const q = Math.floor(numerator / 1000);
  const r = numerator - q * 1000;
  return r >= 500 ? q + 1 : q;
}

function groupThousands(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 1234560 g -> "1.234,560" (Format der 1808, Menge in kg). */
export function formatKgDe(grams: number): string {
  const sign = grams < 0 ? "-" : "";
  const abs = Math.abs(grams);
  const int = Math.floor(abs / 1000);
  const frac = String(abs % 1000).padStart(3, "0");
  return `${sign}${groupThousands(String(int))},${frac}`;
}

/** 270369 Cent -> "2.703,69" */
export function formatEuroDe(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${groupThousands(String(Math.floor(abs / 100)))},${String(abs % 100).padStart(2, "0")}`;
}

/** 270369 Cent -> "2703.69" (XML-Datensatz des FMS) */
export function formatEuroPlain(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** Gramm -> kg als Zahl (für Sheets). */
export function gramsToKg(grams: number): number {
  return grams / 1000;
}

export const MONTH_NAMES_DE = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const;

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "2026-10-07" -> "07.10.2026" */
export function isoToDe(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
