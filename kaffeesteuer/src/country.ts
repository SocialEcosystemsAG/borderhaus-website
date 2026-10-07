// Länderfeld normalisieren. Zoho führt bei manuell angelegten Aufträgen
// gelegentlich "Deutschland" im country_code (August 2026: SO-00941, SO-00966,
// Lücke 81,60 kg). Jeder nicht erkannte Wert ist ein Blocker, kein stilles Weglassen.

const ALIASES: Record<string, string> = {
  de: "DE",
  deu: "DE",
  ger: "DE",
  germany: "DE",
  deutschland: "DE",
  "federal republic of germany": "DE",
  "bundesrepublik deutschland": "DE",
  at: "AT",
  austria: "AT",
  österreich: "AT",
  oesterreich: "AT",
  ch: "CH",
  switzerland: "CH",
  schweiz: "CH",
  suisse: "CH",
  nl: "NL",
  netherlands: "NL",
  "the netherlands": "NL",
  niederlande: "NL",
  nederland: "NL",
  be: "BE",
  belgium: "BE",
  belgien: "BE",
  lu: "LU",
  luxembourg: "LU",
  luxemburg: "LU",
  fr: "FR",
  france: "FR",
  frankreich: "FR",
  it: "IT",
  italy: "IT",
  italien: "IT",
  es: "ES",
  spain: "ES",
  spanien: "ES",
  pt: "PT",
  portugal: "PT",
  dk: "DK",
  denmark: "DK",
  dänemark: "DK",
  se: "SE",
  sweden: "SE",
  pl: "PL",
  poland: "PL",
  polen: "PL",
  cz: "CZ",
  "czech republic": "CZ",
  czechia: "CZ",
  lt: "LT",
  lithuania: "LT",
  lv: "LV",
  latvia: "LV",
  ee: "EE",
  estonia: "EE",
  fi: "FI",
  finland: "FI",
  ie: "IE",
  ireland: "IE",
  gb: "GB",
  uk: "GB",
  "united kingdom": "GB",
  hu: "HU",
  hungary: "HU",
  si: "SI",
  slovenia: "SI",
  sk: "SK",
  slovakia: "SK",
  hr: "HR",
  croatia: "HR",
  gr: "GR",
  greece: "GR",
  no: "NO",
  norway: "NO",
  us: "US",
  usa: "US",
  "united states": "US",
};

export type CountryResult = { code: string; ok: true } | { ok: false; raw: string };

function lookup(value: string): string | undefined {
  const key = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!key) return undefined;
  return ALIASES[key];
}

/**
 * Bevorzugt country_code, fällt auf country zurück. Widersprechen sich beide
 * (z. B. code "DE", Name "Austria"), ist das nicht eindeutig -> Blocker.
 */
export function normalizeCountry(country: { name: string; code: string }): CountryResult {
  const byCode = lookup(country.code);
  const byName = lookup(country.name);
  if (byCode && byName && byCode !== byName) {
    return { ok: false, raw: `${country.name}|${country.code}` };
  }
  const code = byCode ?? byName;
  if (!code) return { ok: false, raw: `${country.name}|${country.code}` };
  return { ok: true, code };
}
