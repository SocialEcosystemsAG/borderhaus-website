// Plausibilitäts-Checkliste (Briefing 5.3). Live berechnet, nicht abhakbar.
// Blocker sperren die Freigabe, Warnungen müssen einzeln bestätigt werden.
import { ampel, formatRkz, laufendeNummer, monthKey, monthRange, prevMonth, type Registrierkennzeichen } from "./calendar.ts";
import type { ComputeResult, LineOutcome } from "./compute.ts";
import { baseSku } from "./sku-mapping.ts";
import type { CheckResult, CheckStatus, HistoryEntry, Position, SourceSnapshot, YearMonth } from "./types.ts";
import { formatEuroDe, formatKgDe, kgToGrams, pad2, taxCents } from "./units.ts";

export type OutputTotals = {
  tab1Grams: number;
  tab2Grams: number;
  form1808Grams: number | null;
  taxCents: number;
  steuerb1b: number | null;
  summe: number | null;
  gesamt: number | null;
};

export type FormState = {
  rkz: Registrierkennzeichen | null;
  crosses: Record<string, string> | null;
  referenceCrosses: Record<string, string>;
  fmsErrors: string[] | null; // null = noch nicht gerendert
  pdfPresent: boolean;
  signaturePresent: boolean;
};

export type OpenItem = { key: string; text: string; since: string };

export type CheckInput = {
  ym: YearMonth;
  today: string;
  rateCentsPerKg: number;
  ids: { unternehmensnummer: string; dienststelle: string };
  snapshot: SourceSnapshot;
  result: ComputeResult;
  history: HistoryEntry[];
  outputs: OutputTotals | null;
  form: FormState;
  openItems: OpenItem[];
  approved: boolean;
  slowBillingGrams?: number | null;
};

const PALLET_WINDOW_DAYS = 60;

function check(
  id: number,
  key: string,
  title: string,
  status: CheckStatus,
  explanation: string,
  details: string[] = [],
): CheckResult {
  return { id, key, title, status, explanation, details, requiresConfirmation: status === "warning" };
}

function fmtLine(l: LineOutcome): string {
  return `${l.orderNumber} · ${l.sku} × ${l.quantity} · ${l.customerName} · ${l.shipDate}`;
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

export function runChecks(input: CheckInput): CheckResult[] {
  const { ym, result, history } = input;
  const mk = monthKey(ym);
  const { from, to } = monthRange(ym);
  const out: CheckResult[] = [];
  const counted = result.positions.filter((p) => p.kind === "regular");

  // 1 Unbekannte SKU / fehlendes Gewicht
  const unknown = result.lines.filter((l) => l.status === "unknown-sku");
  out.push(
    check(
      1,
      "sku",
      "SKU und Gewicht bekannt",
      unknown.length ? "blocker" : "ok",
      unknown.length
        ? `${unknown.length} Position(en) mit Lieferadresse DE haben eine SKU ohne Eintrag in der Mapping-Tabelle. In der Tabelle als Röstkaffee (kg) oder als kein Röstkaffee einordnen.`
        : "Alle DE-Positionen sind in der Mapping-Tabelle eingeordnet.",
      unknown.map((l) => `${fmtLine(l)} · „${l.name}“`),
    ),
  );

  // 2 Länderwert nicht zuordenbar (nur Aufträge, die nicht ausschließlich Nicht-Kaffee enthalten)
  const badCountry = result.lines.filter((l) => l.status === "country-unknown");
  out.push(
    check(
      2,
      "country",
      "Länderwerte eindeutig",
      badCountry.length ? "blocker" : "ok",
      badCountry.length
        ? "Länderfeld leer oder nicht erkannt. Kein stilles Weglassen: Land per Override mit Begründung festlegen."
        : "Alle Länderwerte erkannt (DE, Germany, Deutschland, … → DE).",
      badCountry.map((l) => `${fmtLine(l)} · Land „${l.countryRaw}“`),
    ),
  );

  // 3 Summen exakt
  if (!input.outputs) {
    out.push(check(3, "sums", "Summen identisch", "blocker", "Sheet und Formular sind noch nicht erzeugt."));
  } else {
    const o = input.outputs;
    const tax = taxCents(result.totals.grams, input.rateCentsPerKg);
    const problems: string[] = [];
    if (o.tab1Grams !== result.totals.grams) problems.push(`Tab 1 ${formatKgDe(o.tab1Grams)} kg ≠ Lauf ${formatKgDe(result.totals.grams)} kg`);
    if (o.tab2Grams !== result.totals.grams) problems.push(`Tab 2 ${formatKgDe(o.tab2Grams)} kg ≠ Lauf ${formatKgDe(result.totals.grams)} kg`);
    if (o.form1808Grams !== result.totals.grams) problems.push(`1808 Menge ${o.form1808Grams === null ? "fehlt" : formatKgDe(o.form1808Grams)} ≠ ${formatKgDe(result.totals.grams)} kg`);
    for (const [k, v] of [["Steuer Sheet", o.taxCents], ["steuerb1b", o.steuerb1b], ["summe", o.summe], ["gesamt", o.gesamt]] as const) {
      if (v !== tax) problems.push(`${k} ${v === null ? "fehlt" : formatEuroDe(v)} ≠ ROUND(kg × Satz) ${formatEuroDe(tax)}`);
    }
    out.push(
      check(
        3,
        "sums",
        "Summen identisch",
        problems.length ? "blocker" : "ok",
        problems.length
          ? "Tab 1, Tab 2, 1808 und Steuerbeträge stimmen nicht exakt überein."
          : `Tab 1 = Tab 2 = 1808 = ${formatKgDe(result.totals.grams)} kg; Steuer ${formatEuroDe(tax)} € = steuerb1b = summe = gesamt.`,
        problems,
      ),
    );
  }

  // 4 Doppelmeldung gegen Historie
  //    Paketdaten: Paketnummer schon gemeldet. Auftragsdaten: mehr gemeldet als bestellt
  //    (Restmengen werden in compute.ts automatisch abgezogen).
  const earlier = history.filter((h) => h.month < mk);
  const dupes: string[] = [];
  for (const l of result.lines.filter((x) => x.status === "counted")) {
    const pkgHit = l.packageNumber ? earlier.find((h) => h.packageNumber && h.packageNumber === l.packageNumber) : undefined;
    if (pkgHit) dupes.push(`${l.orderNumber} · Paket ${l.packageNumber} schon gemeldet im Lauf ${pkgHit.month}`);
    else if (l.orderedQuantity !== undefined && (l.reportedBefore ?? 0) + l.quantity > l.orderedQuantity)
      dupes.push(`${l.orderNumber} · ${l.sku}: ${l.reportedBefore} gemeldet + ${l.quantity} jetzt > ${l.orderedQuantity} bestellt`);
  }
  const auto = result.lines.filter((x) => x.status === "already-reported");
  out.push(
    check(
      4,
      "duplicate",
      "Keine Doppelmeldung",
      dupes.length ? "blocker" : "ok",
      dupes.length
        ? "Position ist bereits in einem früheren Lauf gemeldet oder überschreitet die Auftragsmenge."
        : `Keine Doppelmeldung gegen ${earlier.length} Positionen Historie. ${auto.length ? `${auto.length} bereits gemeldete Position(en) automatisch nicht erneut gezählt.` : ""}`.trim(),
      [...dupes, ...auto.map((l) => `${l.orderNumber} · ${l.sku} × ${l.quantity}: ${l.note}`)],
    ),
  );

  // 5 Formularserver / PDF / Unterschrift
  {
    const f = input.form;
    const problems: string[] = [];
    if (f.fmsErrors === null) problems.push("1807/1808 noch nicht über den Formularserver erzeugt");
    else problems.push(...f.fmsErrors.map((e) => `Formularserver: ${e}`));
    if (!f.pdfPresent) problems.push("PDF fehlt");
    if (!f.signaturePresent) problems.push("Unterschrift fehlt");
    out.push(
      check(5, "form", "Formular erzeugt und unterschrieben", problems.length ? "blocker" : "ok",
        problems.length ? "Formular ist nicht versandfertig." : "PDF vom Formularserver ohne Validierungsfehler, unterschrieben.", problems),
    );
  }

  // 6 Registrierkennzeichen
  {
    const r = input.form.rkz;
    const expected = laufendeNummer(ym);
    const problems: string[] = [];
    if (!r) problems.push("Registrierkennzeichen fehlt");
    else {
      if (r.lfd !== expected) problems.push(`lfd. Nr. ${r.lfd} ≠ Formel ${expected}`);
      if (r.monat !== pad2(ym.month)) problems.push(`Monat ${r.monat} ≠ ${pad2(ym.month)}`);
      if (r.jahr !== String(ym.year)) problems.push(`Jahr ${r.jahr} ≠ ${ym.year}`);
      if (r.unternehmensnummer !== input.ids.unternehmensnummer) problems.push("Unternehmensnummer weicht ab");
      if (r.dienststelle !== input.ids.dienststelle) problems.push("Dienststellennummer weicht ab");
    }
    out.push(check(6, "rkz", "Registrierkennzeichen", problems.length ? "blocker" : "ok",
      problems.length ? "Registrierkennzeichen weicht von der Formel ab." : `${formatRkz(r!)} entspricht der Formel.`, problems));
  }

  // 7 Kreuze wie Referenzsatz
  {
    const c = input.form.crosses;
    const diff: string[] = [];
    if (!c) diff.push("Kreuze nicht gesetzt");
    else for (const [k, v] of Object.entries(input.form.referenceCrosses)) if (c[k] !== v) diff.push(`${k}: ${c[k] ?? "—"} statt ${v}`);
    out.push(check(7, "crosses", "Kreuze wie Referenz (Nov 2025 / Jun 2026)", diff.length ? "blocker" : "ok",
      diff.length ? "Kreuze in der 1807 weichen vom Referenzsatz ab." : "Steueranmeldung JA, Entlastung NEIN, Zahlung auf andere Weise, Bezieher JA, alle anderen Rollen NEIN, Anlage 1808.", diff));
  }

  // 8 Schweizer SKU oder Auslandsadresse in der Liste
  {
    const swissDe = result.lines.filter((l) => l.status === "swiss" && l.country === "DE");
    const foreign = result.positions.filter((p) => p.country !== "DE");
    const swissInList = result.positions.filter((p) => /^CH_/i.test(p.sku));
    const d = [
      ...swissDe.map((l) => `Schweizer SKU mit DE-Adresse: ${fmtLine(l)}`),
      ...foreign.map((p) => `Auslandsadresse in der Liste: ${p.orderNumber} · ${p.country}`),
      ...swissInList.map((p) => `CH_-SKU in der Liste: ${p.orderNumber} · ${p.sku}`),
    ];
    const swissOut = result.lines.filter((l) => l.status === "swiss" && l.country !== "DE").length;
    out.push(check(8, "swiss", "Keine Schweizer Ware, keine Auslandsadresse", d.length ? "blocker" : "ok",
      d.length ? "Schweizer Ware oder Auslandsadressen in der Anmeldung." : `Liste enthält nur DE-Adressen und keine CH_-SKU (${swissOut} CH_-Positionen gingen in die Schweiz).`, d));
  }

  // 9 Abgleich Zoho roh vs. Anmeldung
  {
    const rawDe = result.lines.filter((l) => l.country === "DE" && l.kgPerUnit !== undefined && l.status !== "kit-component");
    const rawGrams = rawDe.reduce((s, l) => s + l.quantity * kgToGrams(l.kgPerUnit!), 0);
    const declaredRegular = counted.reduce((s, p) => s + p.grams, 0);
    const diff = rawGrams - declaredRegular;
    const perOrder = new Map<string, number>();
    for (const l of result.lines.filter((x) => x.status === "override-excluded")) perOrder.set(l.orderNumber, (perOrder.get(l.orderNumber) ?? 0) + (l.grams ?? 0));
    const setQty = result.lines.filter((l) => l.status === "counted" && l.note?.startsWith("Menge"));
    const details = [
      `Zoho roh (DE, Röstkaffee, ohne Kit-Inhalte): ${formatKgDe(rawGrams)} kg`,
      `Anmeldung (Versand im Monat): ${formatKgDe(declaredRegular)} kg`,
      ...[...perOrder].map(([o, g]) => `${o}: −${formatKgDe(g)} kg (Override)`),
      ...setQty.map((l) => `${l.orderNumber}: ${l.note}`),
    ];
    out.push(check(9, "zoho-recon", "Abgleich Zoho-Gesamt ↔ Anmeldung", diff !== 0 ? "warning" : "ok",
      diff !== 0 ? `Differenz ${formatKgDe(diff)} kg, je Auftrag aufgeschlüsselt.` : "Zoho-Gesamt (DE, roh, minus Kit-Komponenten) = Anmeldung.", details));
  }

  // 10 Paletten einzeln bestätigen + Umswitch-/Nachbestellmuster
  {
    const pallets = result.lines.filter((l) => l.country === "DE" && /_P$/.test(baseSku(l.sku)) && (l.status === "counted" || l.status === "override-excluded"));
    const details: string[] = [];
    for (const l of pallets) {
      const recent = history.filter(
        (h) =>
          h.recipientKey === l.recipientKey &&
          baseSku(h.sku) === baseSku(l.sku) &&
          h.quantity === l.quantity &&
          h.shipDate && daysBetween(h.shipDate, l.shipDate) >= 0 && daysBetween(h.shipDate, l.shipDate) <= PALLET_WINDOW_DAYS,
      );
      const state = l.status === "override-excluded" ? `ausgeschlossen (${l.note})` : "gezählt";
      details.push(
        `${l.orderNumber} (Ref. ${l.referenceNumber}) · ${l.sku} × ${l.quantity} · ${l.recipientKey} · ${l.shipDate} · ${state}` +
          (recent.length ? ` · ACHTUNG gleiches Muster schon gemeldet: ${recent.map((h) => `${h.orderNumber} ${h.month}`).join(", ")}` : ""),
      );
    }
    out.push(check(10, "pallets", "Paletten einzeln bestätigen", pallets.length ? "warning" : "ok",
      pallets.length ? `Jede Palette (248 kg) einzeln bestätigen; Abgleich mit Empfänger/SKU/Menge der letzten ${PALLET_WINDOW_DAYS} Tage.` : "Keine Paletten im Monat.", details));
  }

  // 11 Teil-/Nachlieferungen älterer Aufträge, Teilversand
  {
    const late = counted.filter((p) => {
      const l = result.lines.find((x) => x.orderNumber === p.orderNumber);
      return l && (l.orderDate < from || l.shippedStatus === "partially_shipped");
    });
    const orders = [...new Set(late.map((p) => p.orderNumber))].map((o) => {
      const l = result.lines.find((x) => x.orderNumber === o)!;
      const g = late.filter((p) => p.orderNumber === o).reduce((s, p) => s + p.grams, 0);
      const why = l.shippedStatus === "partially_shipped" ? `Teilversand, ${l.note ?? "Paketinhalt"}` : `Auftrag vom ${l.orderDate}`;
      return `${o} · ${why} · Versand ${l.shipDate} (${l.shipDateSource}) · ${formatKgDe(g)} kg`;
    });
    const rest = result.lines.filter((l) => l.status === "counted" && l.note?.startsWith("Restmenge")).map((l) => `${l.orderNumber} · ${l.sku}: ${l.note}`);
    out.push(check(11, "late", "Teil- und Nachlieferungen älterer Aufträge", orders.length || rest.length ? "warning" : "ok",
      orders.length || rest.length ? "Nur das Paket im Monat zählt. Bereits gemeldete Mengen werden abgezogen, nur die Restmenge zählt." : "Keine.", [...orders, ...rest]));
  }

  // 12 Sales Returns
  {
    const ret = input.snapshot.salesReturns ?? null;
    out.push(check(12, "returns", "Sales Returns im Monat", ret === null ? "warning" : ret.length ? "warning" : "ok",
      ret === null ? "Retouren konnten nicht abgefragt werden (Quelle ohne Returns). Bereits versteuerte Retouren ggf. im Ausnahmefeld erfassen."
        : ret.length ? "Retouren im Monat. Bereits versteuerte Ware im Ausnahmefeld erfassen." : "Keine Retouren.",
      (ret ?? []).map((r) => `${r.returnNumber} zu ${r.orderNumber} (${r.date})`)));
  }

  // 13 Abweichung zum Ø der letzten 3 Monate
  {
    let m = ym;
    const prev: { key: string; grams: number }[] = [];
    for (let i = 0; i < 3; i++) {
      m = prevMonth(m);
      const key = monthKey(m);
      const g = history.filter((h) => h.month === key && (h.kind ?? "regular") === "regular").reduce((s, h) => s + h.grams, 0);
      if (g > 0) prev.push({ key, grams: g });
    }
    const avg = prev.length ? prev.reduce((s, p) => s + p.grams, 0) / prev.length : 0;
    const dev = avg ? (result.totals.grams - avg) / avg : 0;
    out.push(check(13, "trend", "Abweichung zum Ø der letzten 3 Monate", prev.length && Math.abs(dev) > 0.3 ? "warning" : "ok",
      prev.length ? `${formatKgDe(result.totals.grams)} kg vs. Ø ${formatKgDe(Math.round(avg))} kg (${(dev * 100).toFixed(1)} %)` : "Keine Vormonate in der Historie.",
      prev.map((p) => `${p.key}: ${formatKgDe(p.grams)} kg`)));
  }

  // 14 Slow (Weiterberechnung CT219)
  {
    const slow = counted.filter((p) => /^SLOW/i.test(p.orderNumber));
    const g = slow.reduce((s, p) => s + p.grams, 0);
    const basis = input.slowBillingGrams;
    const status: CheckStatus = !slow.length ? "ok" : basis === undefined || basis === null || basis !== g ? "warning" : "ok";
    out.push(check(14, "slow", "Slow-Aufträge = Basis der Weiterberechnung (CT219)", status,
      slow.length ? `Slow-Summe ${formatKgDe(g)} kg (${formatEuroDe(taxCents(g, input.rateCentsPerKg))} €) in ${new Set(slow.map((p) => p.orderNumber)).size} Aufträgen. ${basis == null ? "Basis der Slow-Weiterberechnung liegt nicht vor: bitte bestätigen." : basis === g ? "Stimmt mit der Weiterberechnung überein." : `Weiterberechnung ${formatKgDe(basis)} kg weicht ab.`}` : "Keine Slow-Aufträge.",
      Object.entries(slow.reduce<Record<string, number>>((a, p) => ((a[baseSku(p.sku)] = (a[baseSku(p.sku)] ?? 0) + p.quantity), a), {})).map(([s, q]) => `${s}: ${q} Kolli`)));
  }

  // 15 Offene/teilversandte DE-Aufträge zum Monatsende (Vorschau Folgemonat)
  {
    const open = input.snapshot.openOrders ?? [];
    out.push(check(15, "preview", "Vorschau Folgemonat: offene/teilversandte Aufträge", open.length ? "warning" : "ok",
      open.length ? "Diese Aufträge waren zum Monatsende offen oder wurden erst danach abgeschlossen; sie zählen im Versandmonat." : "Keine.",
      open.map((o) => `${o.orderNumber} · ${o.customerName} · Auftrag ${o.orderDate} · ${o.shippedStatus}`)));
  }

  // 16 Nachmeldungen/Korrekturen -> Sonstiges-Text
  {
    const extra = result.positions.filter((p) => p.kind !== "regular");
    const text = sonstigesVorschlag(extra);
    out.push(check(16, "sonstiges", "Text für „Sonstiges“ (≤ 120 Zeichen)", extra.length ? "warning" : "ok",
      extra.length ? `Vorschlag: „${text}“ (${text.length} Zeichen)` : "Keine Nachmeldungen oder Korrekturen; Feld bleibt leer.",
      extra.map((p) => `${p.label ?? p.name}: ${formatKgDe(p.grams)} kg`)));
  }

  // 17 Fälligkeit
  {
    const a = ampel(ym, input.today, false);
    const n = { year: ym.month === 12 ? ym.year + 1 : ym.year, month: ym.month === 12 ? 1 : ym.month + 1 };
    const eighth = `${n.year}-${pad2(n.month)}-08`;
    const late = !input.approved && input.today >= eighth;
    out.push(check(17, "due", "Fälligkeit", late ? "warning" : "ok",
      late ? `Am 8. noch nicht freigegeben (Ampel ${a}). Erinnerung an Marcel.` : `Ampel ${a}.`, []));
  }

  // 18 Offene Punkte aus Vormonaten
  out.push(check(18, "open-items", "Offene Punkte aus Vormonaten", input.openItems.length ? "warning" : "ok",
    input.openItems.length ? "Klärung im Ausnahmefeld erfassen." : "Keine.",
    input.openItems.map((o) => `${o.key}: ${o.text} (seit ${o.since})`)));

  // 19 Teilversand ohne Paketinhalt (nur Auftragsdaten)
  {
    const pu = result.lines.filter((l) => l.status === "partial-unknown");
    const byOrder = [...new Set(pu.map((l) => l.orderNumber))].map((o) => {
      const ls = pu.filter((l) => l.orderNumber === o);
      return `${o} (${ls[0].customerName}, Versand ${ls[0].shipDate}): bestellt ${ls.map((l) => `${l.quantity}× ${l.sku}`).join(", ")}`;
    });
    out.push(check(19, "partial", "Teilversand: versendete Menge belegt", pu.length ? "blocker" : "ok",
      pu.length ? "Teilversand ohne Paketinhalt. Gemeldet wird nur, was wirklich rausging: Paketinhalt aus Zoho (Paket des Monats) als Menge erfassen." : "Kein offener Teilversand.",
      byOrder));
  }

  // 20 Mandanten außerhalb der Anmeldung (Information)
  {
    const oos = result.lines.filter((l) => l.status === "out-of-scope" && l.country === "DE");
    const names = [...new Set(oos.map((l) => `${l.customerName}: ${l.note}`))];
    out.push(check(20, "scope", "Mandanten außerhalb der Anmeldung", "ok",
      oos.length ? `${new Set(oos.map((l) => l.orderNumber)).size} Aufträge mit DE-Adresse nicht berücksichtigt.` : "Keine.", names));
  }

  return out;
}

/** Vorschlag für a1807_sonstiges, hart auf 120 Zeichen begrenzt. */
export function sonstigesVorschlag(extra: Position[]): string {
  if (!extra.length) return "";
  const parts = extra.map((p) => `${p.label ?? p.sku} ${formatKgDe(p.grams).replace(/,?0+$/, "")} kg`);
  let text = `Nachmeldung/Korrektur: ${parts.join("; ")}. Details siehe Anlage.`;
  if (text.length > 120) text = `${text.slice(0, 117)}...`;
  return text;
}
