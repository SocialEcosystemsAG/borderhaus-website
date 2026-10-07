// Ein Lauf = ein Monat in einer Version. Ein erneuter Lauf legt eine neue
// Version an und überschreibt nichts; versendet wird nur die freigegebene Version.
import { dueDate, formatRkz, monthKey, registrierkennzeichen, sendBy } from "./calendar.ts";
import { runChecks, sonstigesVorschlag, type OpenItem } from "./checks.ts";
import { aggregateBySku, computeMonth } from "./compute.ts";
import { body, recipients, subject, type MailConfig } from "./email.ts";
import { REFERENCE_CROSSES, datasetXml, formFields, type Stammdaten } from "./fms1807.ts";
import { buildSheet, sheetName } from "./sheet.ts";
import type { SkuMapping } from "./sku-mapping.ts";
import type { CheckResult, HistoryEntry, Override, SourceSnapshot, YearMonth } from "./types.ts";
import { MONTH_NAMES_DE, formatEuroDe, formatKgDe } from "./units.ts";

export type RunConfig = {
  stamm: Stammdaten;
  mail: MailConfig;
  rateCentsPerKg: number;
  /** Mandanten, deren Ware nie in die Anmeldung gehört (mit Begründung). */
  excludedCustomers?: { name: string; reason: string }[];
};

export type RunInput = {
  ym: YearMonth;
  today: string;
  runNumber: number;
  bccOverride?: boolean;
  config: RunConfig;
  snapshot: SourceSnapshot;
  mapping: SkuMapping;
  overrides: Override[];
  history: HistoryEntry[];
  openItems: OpenItem[];
  slowBillingGrams?: number | null;
  /** Zustand des Formulars, sobald über den Formularserver erzeugt. */
  form?: { fmsErrors: string[] | null; pdfPresent: boolean; signaturePresent: boolean; form1808Grams: number | null };
};

export async function buildRun(i: RunInput) {
  const rkz = registrierkennzeichen(i.ym, i.config.stamm);
  const result = computeMonth(i.ym, i.snapshot, i.mapping, i.overrides, i.config.rateCentsPerKg, {
    history: i.history,
    excludedCustomers: i.config.excludedCustomers,
  });
  const skuRows = aggregateBySku(result.positions);
  const sheet = await buildSheet({
    ym: i.ym,
    firma: i.config.stamm.firma,
    rateCentsPerKg: i.config.rateCentsPerKg,
    skuRows,
    positions: result.positions,
    packageNumbersAvailable: i.snapshot.source === "zoho-inventory-packages",
  });
  const sonstiges = sonstigesVorschlag(result.positions.filter((p) => p.kind !== "regular"));
  const formInput = { ym: i.ym, rkz, taxCents: result.totals.taxCents, sonstiges, datum: i.today, stamm: i.config.stamm };
  const fields = formFields(formInput);
  const xml = datasetXml(formInput);
  const form = i.form ?? { fmsErrors: null, pdfPresent: false, signaturePresent: false, form1808Grams: null };
  const tax = result.totals.taxCents;
  const checks: CheckResult[] = runChecks({
    ym: i.ym,
    today: i.today,
    rateCentsPerKg: i.config.rateCentsPerKg,
    ids: i.config.stamm,
    snapshot: i.snapshot,
    result,
    history: i.history,
    outputs: {
      tab1Grams: sheet.tab1Grams,
      tab2Grams: sheet.tab2Grams,
      form1808Grams: form.form1808Grams,
      taxCents: sheet.taxCents,
      // Beträge der Feldbelegung (vom Server zurückgelesen, sobald erzeugt)
      steuerb1b: tax,
      summe: tax,
      gesamt: tax,
    },
    form: {
      rkz,
      crosses: Object.fromEntries(Object.keys(REFERENCE_CROSSES).map((k) => [k, fields[k]])),
      referenceCrosses: REFERENCE_CROSSES,
      fmsErrors: form.fmsErrors,
      pdfPresent: form.pdfPresent,
      signaturePresent: form.signaturePresent,
    },
    openItems: i.openItems,
    approved: false,
    slowBillingGrams: i.slowBillingGrams,
  });
  const rcpt = recipients(i.config.mail, i.runNumber, i.bccOverride);
  const mail = {
    from: i.config.mail.from,
    to: rcpt.to,
    bcc: rcpt.bcc,
    subject: subject(i.config.mail, i.ym, rkz),
    body: body(i.config.mail, i.ym, rkz, result.totals.grams, tax),
  };
  const blockers = checks.filter((c) => c.status === "blocker");
  const warnings = checks.filter((c) => c.status === "warning");
  return {
    month: monthKey(i.ym),
    monthName: `${MONTH_NAMES_DE[i.ym.month - 1]} ${i.ym.year}`,
    rkz: formatRkz(rkz),
    dueDate: dueDate(i.ym),
    sendBy: sendBy(i.ym),
    totals: result.totals,
    totalsText: `${formatKgDe(result.totals.grams)} kg / ${formatEuroDe(tax)} €`,
    mappingVersion: i.mapping.version,
    status: blockers.length ? "Plausi gerechnet (Blocker offen)" : "in Prüfung",
    releasable: blockers.length === 0,
    blockers: blockers.length,
    warnings: warnings.length,
    checks,
    skuRows,
    positions: result.positions,
    lines: result.lines,
    appliedOverrides: result.appliedOverrides,
    proposedOverrides: i.overrides.filter((o) => !result.appliedOverrides.includes(o)),
    sonstiges,
    fields,
    files: { sheet: `${sheetName(i.ym)}.xlsx`, xml: `${sheetName(i.ym)}_Formular_1807_Daten.xml` },
    sheetBytes: sheet.xlsx,
    xml,
    mail,
  };
}

export type Run = Awaited<ReturnType<typeof buildRun>>;

/** Prüfansicht als Markdown (Kopf, Checkliste, Overrides). */
export function renderReview(run: Run): string {
  const icon = { ok: "OK", warning: "WARNUNG", blocker: "BLOCKER" } as const;
  const lines = [
    `# Kaffeesteuer ${run.monthName}`,
    "",
    `- Registrierkennzeichen: ${run.rkz}`,
    `- Menge / Steuer: ${run.totalsText}`,
    `- Aufträge / Positionen: ${run.totals.orders} / ${run.totals.positions}`,
    `- Fällig: ${run.dueDate} (Versand spätestens ${run.sendBy})`,
    `- Status: ${run.status}; Mapping-Tabelle v${run.mappingVersion}`,
    "",
    "## Plausibilitäts-Checkliste",
    "",
  ];
  for (const c of run.checks) {
    lines.push(`### ${c.id}. ${c.title}: ${icon[c.status]}`, "", c.explanation, "");
    for (const d of c.details) lines.push(`- ${d}`);
    if (c.details.length) lines.push("");
  }
  lines.push("## Angewendete Overrides", "");
  for (const o of run.appliedOverrides) lines.push(`- ${o.action} ${"orderNumber" in o ? o.orderNumber : ""}: ${o.reason} (${o.user}, ${o.at}, ${o.source})`);
  if (!run.appliedOverrides.length) lines.push("- keine");
  lines.push("", "## Vorgeschlagen, noch nicht bestätigt", "");
  for (const o of run.proposedOverrides) lines.push(`- ${o.action} ${"orderNumber" in o ? o.orderNumber : ""}: ${o.reason}`);
  if (!run.proposedOverrides.length) lines.push("- keine");
  return lines.join("\n") + "\n";
}
