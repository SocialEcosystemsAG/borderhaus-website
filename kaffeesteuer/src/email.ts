// HZA-Mail (Briefing 7). Wird erst nach „Freigeben & senden“ verschickt, nie automatisch.
import { formatRkz, type Registrierkennzeichen } from "./calendar.ts";
import type { YearMonth } from "./types.ts";
import { MONTH_NAMES_DE, formatEuroDe, formatKgDe } from "./units.ts";

export type MailConfig = {
  from: string;
  to: string[];
  bccAlways: string[];
  /** BCC nur bei den ersten N Läufen (Zähler am Lauf), danach automatisch aus. */
  bccFirstRuns: { address: string; runs: number };
  signature: string[];
  firma: string;
};

/** runNumber: 1 = erster Lauf im Modul (September 2026). override: Schalter in der App. */
export function recipients(cfg: MailConfig, runNumber: number, override?: boolean): { to: string[]; bcc: string[] } {
  const extra = override ?? runNumber <= cfg.bccFirstRuns.runs;
  return { to: cfg.to, bcc: [...cfg.bccAlways, ...(extra ? [cfg.bccFirstRuns.address] : [])] };
}

export function subject(cfg: MailConfig, ym: YearMonth, rkz: Registrierkennzeichen): string {
  return `Kaffeesteuer-Anmeldung ${MONTH_NAMES_DE[ym.month - 1]} ${ym.year} – ${cfg.firma} – ${formatRkz(rkz)}`;
}

export function body(cfg: MailConfig, ym: YearMonth, rkz: Registrierkennzeichen, grams: number, taxCents: number): string {
  return [
    "Sehr geehrte Damen und Herren,",
    "",
    `anbei übersenden wir die monatliche Steueranmeldung für Kaffee (Formular 1807 mit Anlage 1808) der ${cfg.firma} für ${MONTH_NAMES_DE[ym.month - 1]} ${ym.year}, Registrierkennzeichen ${formatRkz(rkz)}.`,
    "",
    `Angemeldete Menge Röstkaffee: ${formatKgDe(grams)} kg, Steuerbetrag: ${formatEuroDe(taxCents)} €. Die Aufstellung nach Artikeln und die Liste aller versendeten Bestellungen liegen bei.`,
    "",
    "Der Steuerbetrag wird fristgerecht überwiesen.",
    "",
    "Mit freundlichen Grüßen",
    ...cfg.signature,
  ].join("\n");
}
