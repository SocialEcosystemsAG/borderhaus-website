import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMonth } from "../src/compute.ts";
import { runChecks } from "../src/checks.ts";
import { DEFAULT_MAPPING } from "../src/sku-mapping.ts";
import { REFERENCE_CROSSES } from "../src/fms1807.ts";
import type { HistoryEntry, Override, SourceOrder, SourceSnapshot } from "../src/types.ts";

function order(no: string, shipDate: string, status: string, lines: [string, number][], customer = "Kunde"): SourceOrder {
  return {
    orderId: no,
    orderNumber: no,
    referenceNumber: no,
    orderDate: "2026-08-25",
    customerName: customer,
    shippedStatus: status,
    country: { name: "Germany", code: "DE" },
    recipientKey: "ADR:x",
    packages: [
      { packageNumber: "", shipDate, shipDateSource: "delivery_date", lines: lines.map(([sku, quantity]) => ({ sku, name: sku, quantity })) },
    ],
  };
}
const snap = (orders: SourceOrder[]): SourceSnapshot => ({ source: "zoho-books-salesorders", componentsListedSeparately: false, fetchedAt: "", orders });
const ov = (o: Partial<Override> & { action: Override["action"] }): Override =>
  ({ id: Math.random().toString(36), reason: "Paket PKG-1", user: "t", at: "t", source: "manual", ...o }) as Override;
const sep = { year: 2026, month: 9 };
const oct = { year: 2026, month: 10 };
const checksFor = (ym: typeof sep, s: SourceSnapshot, r: ReturnType<typeof computeMonth>, history: HistoryEntry[] = []) =>
  runChecks({
    ym, today: "2026-10-07", rateCentsPerKg: 219, ids: { unternehmensnummer: "1", dienststelle: "1" }, snapshot: s, result: r, history, outputs: null,
    form: { rkz: null, crosses: null, referenceCrosses: REFERENCE_CROSSES, fmsErrors: null, pdfPresent: false, signaturePresent: false },
    openItems: [], approved: false,
  });

test("Teilversand ohne Paketinhalt wird nicht gezählt und sperrt die Freigabe", () => {
  const s = snap([order("CA1", "2026-09-09", "partially_shipped", [["CA-R-002_4", 25], ["CA-R-004_4", 12]])]);
  const r = computeMonth(sep, s, DEFAULT_MAPPING, [], 219);
  assert.equal(r.totals.grams, 0);
  assert.equal(checksFor(sep, s, r).find((c) => c.key === "partial")!.status, "blocker");
});

test("Teilversand mit Paketinhalt: nur das Versendete zählt, Rest im Folgemonat", () => {
  const sepSnap = snap([order("CA1", "2026-09-09", "partially_shipped", [["CA-R-002_4", 25], ["CA-R-004_4", 12]])]);
  const r = computeMonth(sep, sepSnap, DEFAULT_MAPPING, [ov({ action: "set_quantity", orderNumber: "CA1", sku: "CA-R-004_4", quantity: 12 })], 219);
  assert.equal(r.totals.grams, 48_000); // nur 12× Café Crème
  assert.equal(r.lines.find((l) => l.sku === "CA-R-002_4")!.status, "not-in-package");
  assert.equal(checksFor(sep, sepSnap, r).find((c) => c.key === "partial")!.status, "ok");

  // Oktober: Auftrag jetzt vollständig versendet -> nur die Restmenge
  const history: HistoryEntry[] = r.positions.map((p) => ({ month: "2026-09", orderNumber: p.orderNumber, sku: p.sku, quantity: p.quantity, grams: p.grams }));
  const octSnap = snap([order("CA1", "2026-10-05", "fulfilled", [["CA-R-002_4", 25], ["CA-R-004_4", 12]])]);
  const r2 = computeMonth(oct, octSnap, DEFAULT_MAPPING, [], 219, { history });
  assert.equal(r2.totals.grams, 100_000); // 25× Espresso, Café Crème schon gemeldet
  assert.equal(r2.lines.find((l) => l.sku === "CA-R-004_4")!.status, "already-reported");
  assert.equal(checksFor(oct, octSnap, r2, history).find((c) => c.key === "duplicate")!.status, "ok");
});

test("Teilmenge in Vormonat gemeldet: Restmenge derselben SKU", () => {
  const history: HistoryEntry[] = [{ month: "2026-09", orderNumber: "CA2", sku: "CA-R-002_4", quantity: 10, grams: 40_000 }];
  const s = snap([order("CA2", "2026-10-02", "fulfilled", [["CA-R-002_4", 25]])]);
  const r = computeMonth(oct, s, DEFAULT_MAPPING, [], 219, { history });
  assert.equal(r.totals.grams, 60_000);
  assert.match(r.lines[0].note ?? "", /Restmenge 15 von 25/);
});

test("Mandant außerhalb der Anmeldung wird nie berücksichtigt", () => {
  const s = snap([order("N1", "2026-09-30", "fulfilled", [["00124-10", 1]], "Fremdmandant GmbH")]);
  const r = computeMonth(sep, s, DEFAULT_MAPPING, [], 219, { excludedCustomers: [{ name: "Fremdmandant GmbH", reason: "eigene Versteuerung" }] });
  assert.equal(r.totals.grams, 0);
  assert.equal(r.lines[0].status, "out-of-scope");
  assert.equal(checksFor(sep, s, r).find((c) => c.key === "sku")!.status, "ok", "keine unbekannte SKU mehr");
});

test("Land per Override: leeres Länderfeld mit NL-Adresse", () => {
  const o = order("SO-1", "2026-09-03", "fulfilled", [["CA-R-002", 3]]);
  o.country = { name: "", code: "" };
  const s = snap([o]);
  const r = computeMonth(sep, s, DEFAULT_MAPPING, [ov({ action: "set_country", orderNumber: "SO-1", country: "NL" })], 219);
  assert.equal(r.lines[0].status, "not-de");
  assert.equal(checksFor(sep, s, r).find((c) => c.key === "country")!.status, "ok");
});
