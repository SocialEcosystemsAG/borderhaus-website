// Registrierkennzeichen, Fälligkeit, Ampel.
import type { YearMonth } from "./types.ts";
import { pad2 } from "./units.ts";

export const ABGABENART = "TKA";

/**
 * Laufende Nummer: zählt monatlich, Start September 2025 = 0001.
 * lfd = (Jahr − 2025) × 12 + Monat − 8, vierstellig.
 * (Juni 2026 ging mit 0007 statt 0010 raus; Entscheidung: keine Korrektur,
 * Formel gilt unverändert. Wird bewusst nicht als Flag angezeigt.)
 */
export function laufendeNummer({ year, month }: YearMonth): string {
  const n = (year - 2025) * 12 + month - 8;
  if (n < 1 || n > 9999) throw new Error(`lfd. Nr. außerhalb des Bereichs: ${n}`);
  return String(n).padStart(4, "0");
}

export type Registrierkennzeichen = {
  abgabenart: string;
  lfd: string;
  unternehmensnummer: string;
  monat: string;
  jahr: string;
  dienststelle: string;
};

export function registrierkennzeichen(
  ym: YearMonth,
  ids: { unternehmensnummer: string; dienststelle: string },
): Registrierkennzeichen {
  return {
    abgabenart: ABGABENART,
    lfd: laufendeNummer(ym),
    unternehmensnummer: ids.unternehmensnummer,
    monat: pad2(ym.month),
    jahr: String(ym.year),
    dienststelle: ids.dienststelle,
  };
}

export function formatRkz(r: Registrierkennzeichen): string {
  return [r.abgabenart, r.lfd, r.unternehmensnummer, r.monat, r.jahr, r.dienststelle].join("-");
}

export function nextMonth({ year, month }: YearMonth): YearMonth {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

export function prevMonth({ year, month }: YearMonth): YearMonth {
  return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
}

export function monthKey({ year, month }: YearMonth): string {
  return `${year}-${pad2(month)}`;
}

export function monthRange({ year, month }: YearMonth): { from: string; to: string } {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { from: `${year}-${pad2(month)}-01`, to: `${year}-${pad2(month)}-${pad2(last)}` };
}

/** Fällig am 10. des Folgemonats. */
export function dueDate(ym: YearMonth): string {
  const n = nextMonth(ym);
  return `${n.year}-${pad2(n.month)}-10`;
}

/** Spätester Versandtag: der 10., bei Wochenende der Freitag davor. */
export function sendBy(ym: YearMonth): string {
  const d = new Date(`${dueDate(ym)}T12:00:00Z`);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export type Ampel = "grün" | "gelb" | "rot";

/**
 * Ampel ab dem 5. des Folgemonats: gelb ab dem 5., rot ab dem 8. (bzw. am
 * Tag nach dem spätesten Versandtag) solange nicht versendet.
 */
export function ampel(ym: YearMonth, today: string, sent: boolean): Ampel {
  if (sent) return "grün";
  const n = nextMonth(ym);
  const fifth = `${n.year}-${pad2(n.month)}-05`;
  const eighth = `${n.year}-${pad2(n.month)}-08`;
  if (today >= eighth || today > sendBy(ym)) return "rot";
  if (today >= fifth) return "gelb";
  return "grün";
}
