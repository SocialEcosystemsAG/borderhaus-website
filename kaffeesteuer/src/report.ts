// Prüf- und Entscheidungsbericht im Format des Juli-Berichts 2026
// (Arial, Überschriften #1f3864, Tabellen mit Kopfzeile #d9e2f3 und Rahmen #bfbfbf).
// Ausgabe als HTML; beim Hochladen nach Google Drive wird daraus ein Google Doc
// mit derselben Gestaltung. Der Bericht ist intern und geht nicht ans Zollamt.

export type ReportTable = { header: string[]; rows: string[][]; widths?: number[]; boldCells?: [number, number][] };
export type ReportSection = { title: string; paragraphs?: string[]; table?: ReportTable; after?: string[] };
export type ReportInput = {
  firma: string;
  title: string; // z. B. "Kaffeesteuer September 2026 — Prüf- und Entscheidungsbericht"
  subtitle: string; // z. B. "Interne Dokumentation … · HZA Berlin · Stand 07.10.2026"
  intro: string;
  sections: ReportSection[];
  closing?: string[];
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** **fett** im Text erlauben */
const rich = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<span style="font-weight:700">$1</span>');

const P = 'style="padding-top:0pt;margin:0;color:#000000;padding-left:0;font-size:10.5pt;padding-bottom:6pt;font-family:Arial;line-height:1.0;text-align:left;padding-right:0"';
const H = (size: number) =>
  `style="padding-top:12pt;margin:0;color:#1f3864;font-weight:700;padding-left:0;font-size:${size}pt;padding-bottom:6pt;line-height:1.0;font-family:Arial;text-align:left;padding-right:0"`;
const CELL = (w: number, head: boolean) =>
  `style="border:1pt solid #bfbfbf;padding:3pt 5pt 3pt 5pt;vertical-align:top;width:${w}pt${head ? ";background-color:#d9e2f3" : ""}"`;
const CELLP = 'style="padding:0;margin:0;color:#000000;font-size:10.5pt;font-family:Arial;line-height:1.0;text-align:left"';

function table(t: ReportTable): string {
  const total = 451.3;
  const widths = t.widths ?? t.header.map(() => total / t.header.length);
  const cell = (txt: string, w: number, head: boolean, bold: boolean) =>
    `<td ${CELL(w, head)}><p ${CELLP}><span style="font-size:9.5pt${head || bold ? ";font-weight:700" : ""}">${rich(txt)}</span></p></td>`;
  const bold = new Set((t.boldCells ?? []).map(([r, c]) => `${r}:${c}`));
  return (
    `<table style="border-spacing:0;border-collapse:collapse;margin-right:auto">` +
    `<tr>${t.header.map((h, i) => cell(h, widths[i], true, true)).join("")}</tr>` +
    t.rows.map((r, ri) => `<tr>${r.map((c, ci) => cell(c, widths[ci], false, bold.has(`${ri}:${ci}`))).join("")}</tr>`).join("") +
    `</table><p ${P}></p>`
  );
}

export function renderReportHtml(r: ReportInput): string {
  const parts = [
    `<p ${P}><span style="color:#595959">${esc(r.firma)}</span></p>`,
    `<h1 ${H(16)}>${esc(r.title)}</h1>`,
    `<p ${P}><span style="color:#595959;font-style:italic">${esc(r.subtitle)}</span></p>`,
    `<p ${P}>${rich(r.intro)}</p>`,
  ];
  for (const s of r.sections) {
    parts.push(`<h2 ${H(13)}>${esc(s.title)}</h2>`);
    for (const p of s.paragraphs ?? []) parts.push(`<p ${P}>${rich(p)}</p>`);
    if (s.table) parts.push(table(s.table));
    for (const p of s.after ?? []) parts.push(`<p ${P}>${rich(p)}</p>`);
  }
  for (const p of r.closing ?? []) parts.push(`<p ${P}>${rich(p)}</p>`);
  return (
    `<!doctype html><html><head><meta charset="utf-8"><title>${esc(r.title)}</title></head>` +
    `<body style="background-color:#ffffff;max-width:451.3pt;padding:72pt 72pt 72pt 72pt">${parts.join("")}</body></html>`
  );
}

export const STANDARD_INTRO =
  "Dieser Bericht geht nicht ans Zollamt. Er hält fest, welche Mengen angemeldet wurden, wie sie sich zusammensetzen, was bewusst nicht aufgenommen wurde und worauf sich die Entscheidungen stützen.";

export const STANDARD_LAGERUNG =
  "Lagerung: Der Kaffee lagert auf der niederländischen Seite des Hauses (Bohr 10, Heerlen). Was nach Deutschland versendet wird, wird über die Grenze gebracht und angemeldet. Ab Juni 2026 gilt: angemeldet wird, was im Monat nach Deutschland versendet wurde.";
