import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_MAPPING, kitComponents, resolveSku } from "../src/sku-mapping.ts";
import { computeMonth } from "../src/compute.ts";
import type { SourceSnapshot } from "../src/types.ts";

const kg = (sku: string) => {
  const r = resolveSku(sku, DEFAULT_MAPPING);
  return r.kind === "coffee" ? r.kgPerUnit : r.kind;
};

test("Gewichte laut Tabelle (Briefing 3.3)", () => {
  const cases: [string, number | string][] = [
    ["CA-R-002_P", 248],
    ["CA-R-004_P", 248],
    ["CA-R-002_4", 4],
    ["CA-R-004_4", 4],
    ["CA-S-010_4", 4],
    ["CA-R-002", 1],
    ["CA-S-010", 1],
    ["CA-S-115_8", 2.8],
    ["CA-S-109", 0.35],
    ["CA-S-116", 0.35], // Kongo, neue Sorte, fällt unter CA-S-1xx
    ["CA SP-Large", 1.4],
    ["CA SP-Medium", 1.05],
    ["CA SP_Small_HB&UE", 0.7],
    ["CA SP_Small_UF&UE", 0.7],
    ["CA SP-Small F&E", 0.7],
    ["50076G-K6", 6],
    ["50075G-K6", 6],
    ["41212-K4_ACR", 4],
    ["50077G-K10", 5],
    ["Ken_Filter-1", 1],
    ["Bra_Espresso-1", 1],
    // _old-Varianten zählen wie die Basis-SKU
    ["CA-S-109_8_old1", 2.8],
    ["CA-S-010_4_old", 4],
    ["CA-S-010_old", 1],
    ["50075G-K6_old", 6],
    // Schweizer Ware nie als DE-Röstkaffee
    ["CH_50015-K4_ACR", "swiss"],
    // Unbekanntes ist ein Blocker
    ["00124-10", "unknown"],
    ["EBR3C-EU", "unknown"],
    ["CA-S-1234", "unknown"],
  ];
  for (const [sku, expected] of cases) assert.equal(kg(sku), expected, sku);
});

test("Kit-Zusammensetzung", () => {
  assert.deepEqual(kitComponents("CA SP-Large", DEFAULT_MAPPING)?.map((c) => c.sku).sort(), [
    "CA-S-109",
    "CA-S-115",
    "CA-S-120",
    "CA-S-130",
  ]);
  assert.deepEqual(kitComponents("CA SP_Small_HB&UE", DEFAULT_MAPPING), [
    { sku: "CA-S-109", quantity: 1 },
    { sku: "CA-S-120", quantity: 1 },
  ]);
  assert.deepEqual(kitComponents("CA SP_Small_KF&UF", DEFAULT_MAPPING), [
    { sku: "CA-S-115", quantity: 1 },
    { sku: "CA-S-130", quantity: 1 },
  ]);
  assert.deepEqual(kitComponents("CA-S-120_8", DEFAULT_MAPPING), [{ sku: "CA-S-120", quantity: 8 }]);
  assert.equal(kitComponents("CA-R-002", DEFAULT_MAPPING), null);
});

function snap(lines: SourceSnapshot["orders"][0]["packages"][0]["lines"], separately: boolean): SourceSnapshot {
  return {
    source: separately ? "zoho-inventory-packages" : "zoho-books-salesorders",
    componentsListedSeparately: separately,
    fetchedAt: "",
    orders: [
      {
        orderId: "1",
        orderNumber: "CA1",
        referenceNumber: "1",
        orderDate: "2026-08-01",
        customerName: "Test",
        shippedStatus: "fulfilled",
        country: { name: "Germany", code: "DE" },
        recipientKey: "ADR:x",
        packages: [{ packageNumber: "PKG-1", shipDate: "2026-08-05", shipDateSource: "package", lines }],
      },
    ],
  };
}

test("Kit-Abzug: Komponenten im Paketreport nicht doppelt zählen", () => {
  const r = computeMonth(
    { year: 2026, month: 8 },
    snap(
      [
        { sku: "CA SP-Large", name: "Probierpaket Large", quantity: 2 },
        { sku: "CA-S-109", name: "House Blend", quantity: 3 }, // 2 aus Kits + 1 einzeln gekauft
        { sku: "CA-S-115", name: "Kenia", quantity: 2 },
        { sku: "CA-S-120", name: "Uganda E", quantity: 2 },
        { sku: "CA-S-130", name: "Uganda F", quantity: 2 },
        { sku: "CA-S-120_8", name: "8x Uganda", quantity: 1 },
        { sku: "CA-S-120", name: "Uganda E", quantity: 8 },
      ],
      true,
    ),
    DEFAULT_MAPPING,
    [],
    219,
  );
  // 2 × 1,4 (Kits) + 1 × 0,35 (einzelner Beutel) + 1 × 2,8 (8er) = 5,95 kg
  assert.equal(r.totals.grams, 5_950);
  assert.equal(r.lines.filter((l) => l.status === "kit-component").reduce((s, l) => s + l.quantity, 0), 16);
});

test("Kein Kit-Abzug bei Auftragsdaten (Kits stehen nur als Kombi-Zeile)", () => {
  const r = computeMonth(
    { year: 2026, month: 8 },
    snap(
      [
        { sku: "CA SP-Large", name: "Probierpaket Large", quantity: 1, isCombo: true, components: [{ sku: "CA-S-109", quantity: 1 }] },
        { sku: "CA-S-109", name: "House Blend", quantity: 1 }, // separat gekauft
      ],
      false,
    ),
    DEFAULT_MAPPING,
    [],
    219,
  );
  assert.equal(r.totals.grams, 1_750);
});

test("Nur Versand im Monat mit Lieferadresse DE; Overrides mit Begründung", () => {
  const s = snap([{ sku: "CA-R-002_P", name: "Palette", quantity: 1 }], true);
  s.orders.push({ ...s.orders[0], orderNumber: "CA2", country: { name: "Austria", code: "AT" } });
  s.orders.push({ ...s.orders[0], orderNumber: "CA3", packages: [{ ...s.orders[0].packages[0], shipDate: "2026-09-01" }] });
  const base = computeMonth({ year: 2026, month: 8 }, s, DEFAULT_MAPPING, [], 219);
  assert.equal(base.totals.grams, 248_000);
  const excl = computeMonth(
    { year: 2026, month: 8 },
    s,
    DEFAULT_MAPPING,
    [{ id: "o1", action: "exclude", orderNumber: "CA1", reason: "bereits versteuert", user: "t", at: "t", source: "manual" }],
    219,
  );
  assert.equal(excl.totals.grams, 0);
  assert.equal(excl.appliedOverrides.length, 1);
  assert.equal(excl.lines.find((l) => l.orderNumber === "CA1")?.status, "override-excluded");
});
