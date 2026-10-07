// Paketdaten aus Zoho Inventory: nur versendete Pakete im Monat, mit Paketinhalt.
// Synthetische Daten (keine echten Aufträge).
import { test } from "node:test";
import assert from "node:assert/strict";
import { inventoryToSnapshot, type InvPackage, type InvSalesOrder } from "../src/zoho.ts";
import { computeMonth } from "../src/compute.ts";
import { runChecks } from "../src/checks.ts";
import { DEFAULT_MAPPING } from "../src/sku-mapping.ts";
import { REFERENCE_CROSSES } from "../src/fms1807.ts";
import type { HistoryEntry } from "../src/types.ts";

const ym = { year: 2026, month: 9 };
const range = { from: "2026-09-01", to: "2026-09-30" };

const so: InvSalesOrder = {
  salesorder_id: "1",
  salesorder_number: "SO-T1",
  reference_number: "REF-T1",
  date: "2026-08-25",
  customer_name: "Testkunde",
  shipped_status: "partially_shipped",
  shipping_address: { address: "Teststraße 1", zip: "12345", city: "Teststadt", country: "DE", country_code: "DE" },
  line_items: [
    { line_item_id: "L1", sku: "CA-R-002_4", name: "Espresso 4 kg", quantity: 25 },
    { line_item_id: "L2", sku: "CA-R-004_4", name: "Crème 4 kg", quantity: 12 },
    {
      line_item_id: "L3",
      sku: "CA-S-120_8",
      name: "8x Specialty",
      quantity: 1,
      is_combo_product: true,
      mapped_items: [{ line_item_id: "L4", sku: "CA-S-120", name: "Specialty 350 g", quantity: 8, mapped_quantity: 8 }],
    },
  ],
};

const pkg = (n: string, status: string, shipDate: string | undefined, lines: InvPackage["line_items"]): InvPackage => ({
  package_id: n,
  package_number: `PKG-${n}`,
  salesorder_id: "1",
  salesorder_number: "SO-T1",
  date: "2026-08-28",
  status,
  shipment_order: shipDate ? { shipment_date: shipDate } : undefined,
  line_items: lines,
});

const packages: InvPackage[] = [
  // August versendet: gehört nicht in den September
  pkg("A", "delivered", "2026-08-29", [{ so_line_item_id: "L1", sku: "CA-R-002_4", name: "Espresso 4 kg", quantity: 5 }]),
  // September versendet: Teil der Espresso-Zeile plus Kit mit Komponentenzeile
  pkg("B", "shipped", "2026-09-09", [
    { so_line_item_id: "L1", sku: "CA-R-002_4", name: "Espresso 4 kg", quantity: 10 },
    { so_line_item_id: "L3", sku: "CA-S-120_8", name: "8x Specialty", quantity: 1 },
    { so_line_item_id: "L4", sku: "CA-S-120", name: "Specialty 350 g", quantity: 8 },
  ]),
  // gepackt, aber noch nicht versendet
  pkg("C", "not_shipped", undefined, [{ so_line_item_id: "L2", sku: "CA-R-004_4", name: "Crème 4 kg", quantity: 12 }]),
  // erst im Oktober versendet
  pkg("D", "shipped", "2026-10-02", [{ so_line_item_id: "L1", sku: "CA-R-002_4", name: "Espresso 4 kg", quantity: 10 }]),
];

const history: HistoryEntry[] = [
  { month: "2026-08", orderNumber: "SO-T1", packageNumber: "PKG-A", sku: "CA-R-002_4", quantity: 5, grams: 20_000 },
];

function checksFor(h: HistoryEntry[]) {
  const snapshot = inventoryToSnapshot(packages, [so], range, "");
  const r = computeMonth(ym, snapshot, DEFAULT_MAPPING, [], 219, { history: h });
  const checks = runChecks({
    ym,
    today: "2026-10-07",
    rateCentsPerKg: 219,
    ids: { unternehmensnummer: "123456", dienststelle: "9999" },
    snapshot,
    result: r,
    history: h,
    outputs: null,
    form: { rkz: null, crosses: null, referenceCrosses: REFERENCE_CROSSES, fmsErrors: null, pdfPresent: false, signaturePresent: false },
    openItems: [],
    approved: false,
  });
  return { snapshot, r, checks };
}

test("Inventory: nur Pakete, die im Monat rausgingen, mit Paketinhalt", () => {
  const { snapshot, r } = checksFor(history);
  assert.deepEqual(
    snapshot.orders.flatMap((o) => o.packages.map((p) => p.packageNumber)),
    ["PKG-B"],
  );
  // 10 × 4 kg + Kit 2,8 kg; die Komponentenzeile wird nicht doppelt gezählt
  assert.equal(r.totals.grams, 42_800);
  assert.deepEqual(
    r.positions.map((p) => `${p.packageNumber}|${p.sku}|${p.quantity}`).sort(),
    ["PKG-B|CA-R-002_4|10", "PKG-B|CA-S-120_8|1"],
  );
  assert.equal(r.lines.find((l) => l.sku === "CA-S-120")?.status, "kit-component");
  // keine Restmengen-Rechnung auf Paketdaten: der Paketinhalt ist die Menge
  assert.equal(r.lines.filter((l) => l.status === "partial-unknown" || l.status === "already-reported").length, 0);
});

test("Inventory: Teillieferung über zwei Monate ist keine Doppelmeldung", () => {
  const { checks } = checksFor(history);
  const dup = checks.find((c) => c.key === "duplicate")!;
  assert.equal(dup.status, "ok", dup.details.join("\n"));
});

test("Inventory: Paket schon gemeldet oder mehr als bestellt ist ein Blocker", () => {
  const again = checksFor([...history, { month: "2026-08", orderNumber: "SO-T1", packageNumber: "PKG-B", sku: "CA-R-002_4", quantity: 10, grams: 40_000 }]);
  assert.equal(again.checks.find((c) => c.key === "duplicate")!.status, "blocker");
  const over = checksFor([{ month: "2026-08", orderNumber: "SO-T1", sku: "CA-R-002_4", quantity: 20, grams: 80_000 }]);
  const dup = over.checks.find((c) => c.key === "duplicate")!;
  assert.equal(dup.status, "blocker");
  assert.match(dup.details.join("\n"), /20 gemeldet \+ 10 jetzt > 25 bestellt/);
});
