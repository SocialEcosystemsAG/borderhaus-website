// Formular 1807 (inkl. Anlage 1808) über das Formular-Management-System der
// Bundesfinanzverwaltung (https://www.formulare-bfinv.de/ffw/action/invoke.do?id=1807).
// Es gibt kein leeres PDF; das PDF entsteht über die Druckfunktion des Servers.
//
// Ausgabekanal ist austauschbar (ab 01.01.2027 Zoll-Portal Pflicht), siehe channel.ts.
import { formatRkz, type Registrierkennzeichen } from "./calendar.ts";
import type { YearMonth } from "./types.ts";
import { formatEuroDe, formatEuroPlain, MONTH_NAMES_DE, pad2 } from "./units.ts";

/** Private Stammdaten (nicht im Repo, siehe config.example.json). */
export type Stammdaten = {
  firma: string;
  rechtsform: string;
  land: string;
  plz: string;
  ort: string;
  strasse: string;
  hausnummer: string;
  hza: string;
  email: string;
  telefon: string;
  ansprechpartner: string;
  ansprechpartnerEmail: string;
  ansprechpartnerTelefon: string;
  unterschriftOrt: string;
  unternehmensnummer: string;
  dienststelle: string;
};

export type Form1807Input = {
  ym: YearMonth;
  rkz: Registrierkennzeichen;
  taxCents: number;
  sonstiges: string; // max. 120 Zeichen, nur bei Nachmeldungen/Korrekturen
  datum: string; // YYYY-MM-DD (Datum der Erzeugung)
  stamm: Stammdaten;
};

/** Referenzsatz der Kreuze (eingereichte Meldungen Nov 2025 und Jun 2026). */
export const REFERENCE_CROSSES: Record<string, string> = {
  k1: "a1807_k1", // Monatliche Steueranmeldung JA
  k3: "a1807_k4", // Entlastungsanmeldung NEIN
  k5: "a1807_k6", // Entrichtung auf andere Weise
  k13: "a1807_k13n", // Versandhändler NEIN
  k7: "a1807_k7n", // Steuerlagerinhaber NEIN
  k9: "a1807_k9j", // Bezieher (§ 17 Abs. 6 KaffeeStG) JA
  k11: "a1807_k11n", // Steuervertreter NEIN
  a1807_k19: "on", // Anlage 1808
};

function deDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** Feldbelegung für POST /ffw/form/update.do (Golden File: test/golden/1807-fields.json). */
export function formFields(i: Form1807Input): Record<string, string> {
  if (i.sonstiges.length > 120) throw new Error(`a1807_sonstiges hat ${i.sonstiges.length} > 120 Zeichen`);
  const s = i.stamm;
  const betrag = formatEuroDe(i.taxCents);
  return {
    name_firma_sb: s.firma,
    rechtsform_sb: s.rechtsform,
    land_sb: s.land,
    plz_de_sb: s.plz,
    ort_sb: s.ort,
    strasse_sb: s.strasse,
    haus_nr_sb: s.hausnummer,
    hza: s.hza,
    e_mail_sb: s.email,
    telefon_sb: s.telefon,
    gruendung_sb: "", // Entscheidung Marcel: leer lassen
    a1807_ansprechpartner: s.ansprechpartner,
    a1807_email: s.ansprechpartnerEmail,
    a1807_telefon: s.ansprechpartnerTelefon,
    ...REFERENCE_CROSSES,
    a1807_mon_steueranmeldung: MONTH_NAMES_DE[i.ym.month - 1],
    a1807_mon_steueranmeldung_jahr: String(i.ym.year),
    a1807_registrierkennzeichen: i.rkz.lfd,
    a1807_registrierkennzeichen2: i.rkz.unternehmensnummer,
    a1807_registrierkennzeichen3: i.rkz.monat,
    a1807_registrierkennzeichen4: i.rkz.jahr,
    a1807_registrierkennzeichen5: i.rkz.dienststelle,
    a1807_sonstiges: i.sonstiges,
    a1807_ort: s.unterschriftOrt,
    a1807_dat: deDate(i.datum),
    steuerb1b: betrag,
    summe: betrag,
    gesamt: betrag,
  };
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * XML-Datensatz im Format von „Daten als XML speichern“ des FMS. Kann im
 * Formular über „Daten aus XML-Datei importieren“ geladen werden (Fallback,
 * wenn der Server nicht direkt erreichbar ist). Element-Reihenfolge exakt wie
 * im FMS-Export August 2026.
 */
export function datasetXml(i: Form1807Input): string {
  const s = i.stamm;
  const plain = formatEuroPlain(i.taxCents);
  const d = deDate(i.datum);
  const els: [string, string][] = [
    ["ID_USER", ".anonymous"],
    ["1807_ansprechpartner", s.ansprechpartner],
    ["1807_email", s.ansprechpartnerEmail],
    ["1807_telefon", s.ansprechpartnerTelefon],
    ["1807_k2", "false"],
    ["1807_mon_steueranmeldung", `01.${pad2(i.ym.month)}.1970 00:00:00`],
    ["1807_mon_steueranmeldung_jahr", `01.01.${i.ym.year} 00:00:00`],
    ["1807_registrierkennzeichen", i.rkz.lfd],
    ["1807_registrierkennzeichen2", i.rkz.unternehmensnummer],
    ["1807_registrierkennzeichen3", i.rkz.monat],
    ["1807_registrierkennzeichen4", i.rkz.jahr],
    ["1807_registrierkennzeichen5", i.rkz.dienststelle],
    ["1807_k5", "false"],
    ["1807_k6", "true"],
    ...(i.sonstiges ? ([["1807_sonstiges", i.sonstiges]] as [string, string][]) : []),
    ["1807_ort", s.unterschriftOrt],
    ["1807_land", s.land],
    ["1807_k22", "true"],
    ["1807_k1", "true"],
    ["name_firma_sb", s.firma],
    ["rechtsform_sb", s.rechtsform],
    ["land_sb", s.land],
    ["plz_de_sb", s.plz],
    ["ort_sb", s.ort],
    ["strasse_sb", s.strasse],
    ["haus_nr_sb", s.hausnummer],
    ["e_mail_sb", s.email],
    ["telefon_sb", s.telefon],
    ["1807_k4", "true"],
    ["summe", plain],
    ["gesamt", plain],
    ["1807_dat", `${d} 00:00:00`],
    ["1807_k7j", "false"],
    ["1807_k9j", "true"],
    ["1807_k11j", "false"],
    ["1807_k13j", "false"],
    ["1807_k13n", "true"],
    ["1807_k7n", "true"],
    ["1807_k9n", "false"],
    ["1807_k11n", "true"],
    ["1807_k7n2", "true"],
    ["1807_k9n2", "true"],
    ["1807_k11n2", "true"],
    ["1807_k3", "false"],
    ["steuerb1b", plain],
    ["hza", s.hza],
    ["1807_dat_formatiert", d],
  ];
  const rows = els.map(([k, v]) => `\t\t\t<element id="${k}">${xmlEscape(v)}</element>`).join("\n");
  const empty = Array.from({ length: 10 }, () => "\t\t\t<datarow />").join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<xml-data xmlns="http://www.lucom.com/ffw/xml-data-1.0.xsd">\n` +
    `\t<form>catalog://Unternehmen/vst/kaffee/1807</form>\n` +
    `\t<instance>\n\t\t<datarow>\n${rows}\n\t\t</datarow>\n` +
    `\t\t<dataset id="betragszeile">\n${empty}\n\t\t</dataset>\n` +
    `\t</instance>\n</xml-data>\n\n`
  );
}

/** Kreuze aus einem FMS-XML-Datensatz lesen (für Check 7 gegen den Referenzsatz). */
export function crossesFromXml(xml: string): Record<string, string> {
  const v = (id: string) => xml.match(new RegExp(`<element id="${id}">([^<]*)</element>`))?.[1];
  const pick = (yes: string, no: string, yesVal: string, noVal: string) =>
    v(yes) === "true" && v(no) !== "true" ? yesVal : v(no) === "true" && v(yes) !== "true" ? noVal : "—";
  return {
    k1: v("1807_k1") === "true" && v("1807_k2") !== "true" ? "a1807_k1" : "a1807_k2",
    k3: v("1807_k4") === "true" && v("1807_k3") !== "true" ? "a1807_k4" : "a1807_k3",
    k5: v("1807_k6") === "true" && v("1807_k5") !== "true" ? "a1807_k6" : "a1807_k5",
    k13: pick("1807_k13j", "1807_k13n", "a1807_k13j", "a1807_k13n"),
    k7: pick("1807_k7j", "1807_k7n", "a1807_k7j", "a1807_k7n"),
    k9: pick("1807_k9j", "1807_k9n", "a1807_k9j", "a1807_k9n"),
    k11: pick("1807_k11j", "1807_k11n", "a1807_k11j", "a1807_k11n"),
    a1807_k19: v("1807_k22") === "true" ? "on" : "",
  };
}

// ---------------------------------------------------------------------------
// HTTP-Client für den Formularserver (serverseitig, am 07.10.2026 für August getestet)

const FMS = "https://www.formulare-bfinv.de";

type Jar = Map<string, string>;

function storeCookies(jar: Jar, res: Response) {
  const raw = (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}

async function req(jar: Jar, url: string, init: RequestInit = {}): Promise<{ res: Response; body: string; url: string }> {
  let current = url.startsWith("http") ? url : `${FMS}${url}`;
  let opts: RequestInit = init;
  for (let hop = 0; hop < 10; hop++) {
    const headers = new Headers(opts.headers);
    if (jar.size) headers.set("Cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));
    const res = await fetch(current, { ...opts, headers, redirect: "manual" });
    storeCookies(jar, res);
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      current = new URL(loc, current).toString();
      opts = { method: "GET" };
      continue;
    }
    return { res, body: await res.text(), url: current };
  }
  throw new Error("FMS: zu viele Weiterleitungen");
}

export function hiddenFields(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of html.matchAll(/<input[^>]*type="hidden"[^>]*>/gi)) {
    const name = m[0].match(/name="([^"]+)"/)?.[1];
    const value = m[0].match(/value="([^"]*)"/)?.[1] ?? "";
    if (name) out[name] = value.replace(/&amp;/g, "&");
  }
  return out;
}

export function fmsErrors(html: string): string[] {
  const i = html.indexOf("Fehler aufgetreten");
  if (i < 0) return [];
  const block = html.slice(i, i + 6000);
  return [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export type FmsResult = { pdf: Uint8Array; xml: string; errors: string[] };

export async function renderViaFms(fields: Record<string, string>): Promise<FmsResult> {
  const jar: Jar = new Map();
  await req(jar, "/ffw/action/invoke.do?id=1807");
  let page = await req(jar, "/ffw/action/invoke.do?id=1807", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "clientCaps=js=1;cookies=1&submitCaps=Weiter",
  });
  const post = async (action: string) => {
    const body = new URLSearchParams({ ...hiddenFields(page.body), ...fields, $action: action });
    page = await req(jar, "/ffw/form/update.do", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return page;
  };
  // zweimal posten: ein Teil der Felder erscheint erst, wenn k1 gesetzt ist
  await post("/form/showPage.do?id=1807");
  await post("/form/showPage.do?id=1807");
  await post("/form/showPage.do?id=1808");
  const errors = fmsErrors(page.body);
  const printed = await post("/form/print.do");
  const pdfLink = printed.body.match(/\/ffw\/resources\/ticket\/[^"'\s]+\/1807\.pdf/)?.[0];
  if (!pdfLink) throw new Error(`FMS: kein PDF-Link. ${fmsErrors(printed.body).join("; ")}`);
  const pdfRes = await fetch(`${FMS}${pdfLink}`, { headers: { Cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; ") } });
  const pdf = new Uint8Array(await pdfRes.arrayBuffer());
  const xmlPage = await post("/form/downloadXMLData.do");
  const xmlLink = xmlPage.body.match(/\/ffw\/resources\/ticket\/[^"'\s]+\/1807\.xml/)?.[0];
  const xml = xmlLink ? (await req(jar, xmlLink)).body : "";
  return { pdf, xml, errors: [...errors, ...fmsErrors(printed.body)] };
}

export { formatRkz };
