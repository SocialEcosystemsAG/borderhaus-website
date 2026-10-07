// Fallback ohne Formularserver: Vorlage aus einem echten FMS-Druck des
// Formulars 1807/1808 (Stand 2025) und Monatswerte direkt im Content-Stream
// tauschen. Die Werte stehen im FMS-Druck in der eingebetteten Arial
// (Identity-H, Glyph-ID = Unicode − 29); getauscht werden nur die Strings der
// variablen Felder, Layout, Kreuze und Stammdaten bleiben unverändert.
// Feldpositionen (Block-Index je Seite) sind am FMS-Druck vom 07.10.2026 geprüft.
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  decodePDFRawStream,
  type PDFPage,
} from "pdf-lib";

export type TemplateField =
  | "monat"
  | "monat_jahr"
  | "lfd"
  | "mm"
  | "jjjj"
  | "sonstiges"
  | "datum_u1"
  | "datum_u2"
  | "datum_1808"
  | "steuerb1b"
  | "summe"
  | "gesamt";

/** Feld -> [Seitenindex, BT-Block-Index] im FMS-Druck 1807 (2025). */
export const TEMPLATE_FIELDS: Record<TemplateField, [number, number]> = {
  monat: [1, 16],
  monat_jahr: [1, 15],
  lfd: [1, 22],
  mm: [1, 24],
  jjjj: [1, 25],
  sonstiges: [2, 8],
  datum_u1: [2, 11],
  datum_u2: [2, 12],
  datum_1808: [4, 10],
  steuerb1b: [4, 23],
  summe: [4, 62],
  gesamt: [4, 86],
};
const RIGHT_ALIGNED: TemplateField[] = ["steuerb1b", "summe", "gesamt"];
/** Rechte Kante der Betragsfelder (pt), gemessen am FMS-Druck. */
export const AMOUNT_RIGHT_EDGE = { steuerb1b: 481.89, summe: 481.89, gesamt: 481.89 } as const;
const SONSTIGES_MAX_WIDTH = 470; // pt, eine Zeile im Feld „Sonstiges“

// ---------------------------------------------------------------------------
// minimaler Content-Stream-Tokenizer (genügt für iText-Ausgabe)

type Tok = { kind: "str" | "hex" | "num" | "name" | "op" | "arr" | "other"; start: number; end: number; text: string };

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const ws = /[\s\0]/;
  while (i < s.length) {
    const c = s[i];
    if (ws.test(c)) { i++; continue; }
    if (c === "%") { while (i < s.length && s[i] !== "\n" && s[i] !== "\r") i++; continue; }
    const start = i;
    if (c === "(") {
      let depth = 1; i++;
      while (i < s.length && depth > 0) {
        if (s[i] === "\\") { i += 2; continue; }
        if (s[i] === "(") depth++;
        else if (s[i] === ")") depth--;
        i++;
      }
      out.push({ kind: "str", start, end: i, text: s.slice(start, i) });
    } else if (c === "<" && s[i + 1] !== "<") {
      i = s.indexOf(">", i) + 1;
      out.push({ kind: "hex", start, end: i, text: s.slice(start, i) });
    } else if (c === "[" || c === "]" || (c === "<" && s[i + 1] === "<") || (c === ">" && s[i + 1] === ">")) {
      i += c === "[" || c === "]" ? 1 : 2;
      out.push({ kind: "arr", start, end: i, text: s.slice(start, i) });
    } else if (c === "/") {
      i++;
      while (i < s.length && !/[\s\0/[\]()<>{}%]/.test(s[i])) i++;
      out.push({ kind: "name", start, end: i, text: s.slice(start, i) });
    } else {
      while (i < s.length && !/[\s\0/[\]()<>{}%]/.test(s[i])) i++;
      if (i === start) i++;
      const text = s.slice(start, i);
      out.push({ kind: /^[+-]?(\d+\.?\d*|\.\d+)$/.test(text) ? "num" : "op", start, end: i, text });
    }
  }
  return out;
}

function unescapeLiteral(lit: string): number[] {
  const body = lit.slice(1, -1);
  const bytes: number[] = [];
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch !== "\\") { bytes.push(ch.charCodeAt(0) & 0xff); continue; }
    const n = body[++i];
    const map: Record<string, number> = { n: 10, r: 13, t: 9, b: 8, f: 12, "(": 40, ")": 41, "\\": 92 };
    if (n in map) bytes.push(map[n]);
    else if (/[0-7]/.test(n)) {
      let oct = n;
      while (oct.length < 3 && /[0-7]/.test(body[i + 1] ?? "")) oct += body[++i];
      bytes.push(parseInt(oct, 8) & 0xff);
    } else if (n === "\n" || n === "\r") { /* Zeilenfortsetzung */ }
    else bytes.push(n.charCodeAt(0) & 0xff);
  }
  return bytes;
}

const decodeCid = (bytes: number[]) => {
  let t = "";
  for (let i = 0; i + 1 < bytes.length; i += 2) {
    const code = (bytes[i] << 8) | bytes[i + 1];
    t += code === 3 ? " " : String.fromCharCode(code + 29);
  }
  return t;
};
const encodeCidHex = (text: string) =>
  `<${[...text].map((ch) => (ch === " " ? 3 : ch.charCodeAt(0) - 29).toString(16).padStart(4, "0")).join("")}>`;

type Block = { tm?: { tokens: Tok[] }; tjs: { tok: Tok; font: string; size: number; text: string }[] };

function blocks(src: string): { toks: Tok[]; blocks: Block[]; helv: Tok[] } {
  const toks = tokenize(src);
  const out: Block[] = [];
  const helv: Tok[] = [];
  let cur: Block | null = null;
  let font = "";
  let size = 0;
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (t.kind !== "op") continue;
    if (t.text === "BT") cur = { tjs: [] };
    else if (t.text === "Tf") { font = toks[k - 2].text; size = Number(toks[k - 1].text); }
    else if (t.text === "Tm" && cur) cur.tm = { tokens: toks.slice(k - 6, k) };
    else if (t.text === "Tj" && cur) {
      const s = toks[k - 1];
      const bytes = s.kind === "str" ? unescapeLiteral(s.text) : (s.text.slice(1, -1).match(/../g) ?? []).map((h) => parseInt(h, 16));
      cur.tjs.push({ tok: s, font, size, text: font === "/F1" || font === "/F2" ? decodeCid(bytes) : String.fromCharCode(...bytes) });
    } else if (t.text === "TJ" && font === "/helv") {
      // nachträglich eingesetzte kg-Angabe (Helvetica): Array vor dem Operator
      let j = k - 1;
      while (j >= 0 && toks[j].text !== "[") j--;
      helv.push({ kind: "other", start: toks[j].start, end: toks[k - 1].end, text: "" });
    } else if (t.text === "ET" && cur) { out.push(cur); cur = null; }
  }
  return { toks, blocks: out, helv };
}

// ---------------------------------------------------------------------------

function widthFn(page: PDFPage, fontKey: string) {
  const fonts = page.node.Resources()?.lookup(PDFName.of("Font"), PDFDict);
  const font = fonts?.lookup(PDFName.of(fontKey.slice(1)), PDFDict);
  const desc = font?.lookup(PDFName.of("DescendantFonts"), PDFArray)?.lookup(0, PDFDict);
  const dw = desc?.lookup(PDFName.of("DW"), PDFNumber)?.asNumber() ?? 1000;
  const W = desc?.lookup(PDFName.of("W"), PDFArray);
  const m = new Map<number, number>();
  if (W) {
    for (let i = 0; i < W.size(); ) {
      const first = (W.lookup(i, PDFNumber) as PDFNumber).asNumber();
      const next = W.lookup(i + 1);
      if (next instanceof PDFArray) {
        for (let k = 0; k < next.size(); k++) m.set(first + k, (next.lookup(k, PDFNumber) as PDFNumber).asNumber());
        i += 2;
      } else {
        const last = (next as PDFNumber).asNumber();
        const w = (W.lookup(i + 2, PDFNumber) as PDFNumber).asNumber();
        for (let c = first; c <= last; c++) m.set(c, w);
        i += 3;
      }
    }
  }
  return (text: string, size: number) =>
    ([...text].reduce((s, ch) => s + (m.get(ch === " " ? 3 : ch.charCodeAt(0) - 29) ?? dw), 0) * size) / 1000;
}

function pageContent(doc: PDFDocument, page: PDFPage): string {
  const c = page.node.get(PDFName.of("Contents"));
  const refs = c instanceof PDFArray ? c.asArray() : [c];
  let s = "";
  for (const r of refs) {
    const stream = doc.context.lookup(r as PDFRef) as PDFRawStream;
    const bytes = decodePDFRawStream(stream).decode();
    s += Buffer.from(bytes).toString("latin1") + "\n";
  }
  return s;
}

export type TemplateValues = Partial<Record<TemplateField, string>>;

/**
 * Setzt Feldwerte in einem FMS-Druck bzw. in der daraus erzeugten Vorlage.
 * Leerer String = Feld leeren (Blanko). Nicht genannte Felder bleiben.
 * Entfernt außerdem eine nachträglich eingesetzte kg-Angabe (Helvetica) auf Seite 5.
 */
export async function fillTemplate(pdf: Uint8Array, values: TemplateValues, producerNote: string): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdf, { updateMetadata: false });
  const pages = doc.getPages();
  const pageIdx = [...new Set(Object.values(TEMPLATE_FIELDS).map(([p]) => p))];
  for (const p of pageIdx) {
    const page = pages[p];
    const src = pageContent(doc, page);
    const { blocks: bl, helv } = blocks(src);
    const edits: { start: number; end: number; text: string }[] = [];
    for (const [field, [fp, bi]] of Object.entries(TEMPLATE_FIELDS) as [TemplateField, [number, number]][]) {
      if (fp !== p || values[field] === undefined) continue;
      const value = values[field]!;
      const b = bl[bi];
      if (!b || !b.tjs.length) throw new Error(`Vorlage passt nicht: Feld ${field} (Seite ${p + 1}, Block ${bi}) fehlt`);
      if (field === "datum_u1" || field === "datum_u2") {
        const last = b.tjs[b.tjs.length - 1];
        if (!last.text.startsWith("Berlin")) edits.push({ start: last.tok.start, end: last.tok.end, text: encodeCidHex(value) });
        else edits.push({ start: last.tok.end, end: last.tok.end, text: "" });
        continue;
      }
      const { font, size } = b.tjs[0];
      const w = widthFn(page, font);
      if (field === "sonstiges" && w(value, size) > SONSTIGES_MAX_WIDTH) throw new Error("„Sonstiges“ passt nicht in eine Zeile der Vorlage; Formularserver verwenden");
      edits.push({ start: b.tjs[0].tok.start, end: b.tjs[0].tok.end, text: encodeCidHex(value) });
      for (const t of b.tjs.slice(1)) edits.push({ start: t.tok.start, end: t.tok.end, text: "<>" });
      if (b.tm && RIGHT_ALIGNED.includes(field) && value) {
        // rechtsbündig an der festen rechten Feldkante (auch in der leeren Vorlage)
        const right = AMOUNT_RIGHT_EDGE[field as keyof typeof AMOUNT_RIGHT_EDGE];
        edits.push({ start: b.tm.tokens[4].start, end: b.tm.tokens[4].end, text: (right - w(value, size)).toFixed(2) });
      }
      if (field === "monat" && value && b.tm) {
        const yb = bl[TEMPLATE_FIELDS.monat_jahr[1]];
        const end = Number(b.tm.tokens[4].text) + w(value, size) + 2 * w(" ", size);
        if (yb.tm && end > Number(yb.tm.tokens[4].text)) edits.push({ start: yb.tm.tokens[4].start, end: yb.tm.tokens[4].end, text: end.toFixed(2) });
      }
    }
    if (p === 4) for (const h of helv) edits.push({ start: h.start, end: h.end, text: "[]" });
    edits.sort((a, b) => b.start - a.start);
    let out = src;
    for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    const stream = doc.context.flateStream(Buffer.from(out, "latin1"));
    page.node.set(PDFName.of("Contents"), doc.context.register(stream));
  }
  doc.setProducer(`iText 2.1.7 by 1T3XT; ${producerNote}`);
  doc.setModificationDate(new Date());
  return doc.save({ useObjectStreams: false });
}

/** Feldwerte und alle Textblöcke der Vorlagen-Seiten lesen (Prüfung und Tests). */
export async function readTemplate(pdf: Uint8Array): Promise<{ fields: Record<TemplateField, string>; pages: Record<number, string[]> }> {
  const doc = await PDFDocument.load(pdf, { updateMetadata: false });
  const pages = doc.getPages();
  const fields = {} as Record<TemplateField, string>;
  const texts: Record<number, string[]> = {};
  for (const p of [...new Set(Object.values(TEMPLATE_FIELDS).map(([x]) => x))]) {
    const { blocks: bl } = blocks(pageContent(doc, pages[p]));
    texts[p] = bl.map((b) => b.tjs.map((t) => t.text).join(""));
    for (const [f, [fp, bi]] of Object.entries(TEMPLATE_FIELDS) as [TemplateField, [number, number]][]) {
      if (fp !== p) continue;
      const tjs = bl[bi]?.tjs ?? [];
      fields[f] = f.startsWith("datum_u") ? (tjs[tjs.length - 1]?.text ?? "") : tjs.map((t) => t.text).join("");
    }
  }
  return { fields, pages: texts };
}
