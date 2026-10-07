// Aus dem Zoho-Snapshot die anzumeldenden Positionen eines Monats bilden.
// Bemessungsgrundlage: Röstkaffee, der im Monat aus NL nach DE versendet wurde
// (Versanddatum des Pakets im Monat, Lieferadresse DE). Nichts anderes.
import { monthRange } from "./calendar.ts";
import { normalizeCountry } from "./country.ts";
import { baseSku, kitComponents, resolveSku, type SkuMapping } from "./sku-mapping.ts";
import type { Override, Position, RunTotals, SourceSnapshot, YearMonth } from "./types.ts";
import { kgToGrams, taxCents } from "./units.ts";

export type LineStatus =
  | "counted"
  | "not-de"
  | "country-unknown"
  | "excluded-sku"
  | "swiss"
  | "unknown-sku"
  | "kit-component"
  | "override-excluded";

export type LineOutcome = {
  orderNumber: string;
  referenceNumber: string;
  orderDate: string;
  customerName: string;
  recipientKey: string;
  packageNumber: string;
  shipDate: string;
  shipDateSource: string;
  shippedStatus: string;
  countryRaw: string;
  country: string | null;
  sku: string;
  name: string;
  quantity: number;
  status: LineStatus;
  kgPerUnit?: number;
  grams?: number;
  note?: string;
};

export type ComputeResult = {
  lines: LineOutcome[];
  positions: Position[];
  totals: RunTotals;
  appliedOverrides: Override[];
};

export function computeMonth(
  ym: YearMonth,
  snapshot: SourceSnapshot,
  mapping: SkuMapping,
  overrides: Override[],
  rateCentsPerKg: number,
): ComputeResult {
  const { from, to } = monthRange(ym);
  const lines: LineOutcome[] = [];
  const applied = new Set<string>();

  for (const order of snapshot.orders) {
    const countryOverride = overrides.find((o) => o.action === "set_country" && o.orderNumber === order.orderNumber);
    if (countryOverride) applied.add(countryOverride.id);
    const country =
      countryOverride && countryOverride.action === "set_country"
        ? normalizeCountry({ name: countryOverride.country, code: countryOverride.country })
        : normalizeCountry(order.country);
    for (const pkg of order.packages) {
      if (pkg.shipDate < from || pkg.shipDate > to) continue;

      const base = {
        orderNumber: order.orderNumber,
        referenceNumber: order.referenceNumber,
        orderDate: order.orderDate,
        customerName: order.customerName,
        recipientKey: order.recipientKey,
        packageNumber: pkg.packageNumber,
        shipDate: pkg.shipDate,
        shipDateSource: pkg.shipDateSource,
        shippedStatus: order.shippedStatus,
        countryRaw: `${order.country.name}|${order.country.code}`,
        country: country.ok ? country.code : null,
      };

      // Kit-Komponenten, die der Paketreport zusätzlich als Einzelzeilen führt
      const pendingComponents = new Map<string, number>();
      if (snapshot.componentsListedSeparately) {
        for (const line of pkg.lines) {
          const comps = line.components?.length ? line.components : kitComponents(line.sku, mapping);
          if (!comps) continue;
          for (const c of comps) {
            const k = baseSku(c.sku);
            pendingComponents.set(k, (pendingComponents.get(k) ?? 0) + c.quantity * line.quantity);
          }
        }
      }

      for (const line of pkg.lines) {
        let qty = line.quantity;
        const rec = (status: LineStatus, quantity: number, extra: Partial<LineOutcome> = {}) =>
          lines.push({ ...base, sku: line.sku, name: line.name, quantity, status, ...extra });

        if (!country.ok) {
          rec("country-unknown", qty, { note: `Länderwert nicht zuordenbar: ${base.countryRaw}` });
          continue;
        }
        const res = resolveSku(line.sku, mapping);
        if (country.code !== "DE") {
          rec(res.kind === "swiss" ? "swiss" : "not-de", qty);
          continue;
        }
        if (res.kind === "swiss") {
          rec("swiss", qty, { note: "Schweizer SKU mit Lieferadresse DE" });
          continue;
        }
        if (res.kind === "excluded") {
          rec("excluded-sku", qty, { note: res.reason });
          continue;
        }
        if (res.kind === "unknown") {
          rec("unknown-sku", qty, { note: "SKU nicht in der Mapping-Tabelle" });
          continue;
        }

        // Kit-Komponente abziehen (nur wenn die Quelle Komponenten doppelt führt)
        const pending = pendingComponents.get(baseSku(line.sku)) ?? 0;
        const isKitLine = Boolean(line.isCombo) || kitComponents(line.sku, mapping) !== null;
        if (pending > 0 && !isKitLine) {
          const take = Math.min(pending, qty);
          pendingComponents.set(baseSku(line.sku), pending - take);
          rec("kit-component", take, {
            kgPerUnit: res.kgPerUnit,
            grams: take * kgToGrams(res.kgPerUnit),
            note: "Inhalt eines Probierpakets, mit Kit-Gewicht gewertet",
          });
          qty -= take;
          if (qty === 0) continue;
        }

        // Overrides (Pflicht-Begründung, protokolliert)
        const excl = overrides.find(
          (o) =>
            o.action === "exclude" &&
            o.orderNumber === order.orderNumber &&
            (!o.sku || baseSku(o.sku) === baseSku(line.sku)) &&
            (!o.packageNumber || o.packageNumber === pkg.packageNumber),
        );
        if (excl) {
          applied.add(excl.id);
          rec("override-excluded", qty, {
            kgPerUnit: res.kgPerUnit,
            grams: qty * kgToGrams(res.kgPerUnit),
            note: excl.reason,
          });
          continue;
        }
        const setQty = overrides.find(
          (o) =>
            o.action === "set_quantity" &&
            o.orderNumber === order.orderNumber &&
            baseSku(o.sku) === baseSku(line.sku),
        );
        let note: string | undefined;
        if (setQty && setQty.action === "set_quantity") {
          applied.add(setQty.id);
          note = `Menge ${qty} → ${setQty.quantity}: ${setQty.reason}`;
          qty = setQty.quantity;
        }
        rec("counted", qty, { kgPerUnit: res.kgPerUnit, grams: qty * kgToGrams(res.kgPerUnit), note });
      }
    }
  }

  const positions: Position[] = lines
    .filter((l) => l.status === "counted" && l.quantity > 0)
    .map((l) => ({
      orderNumber: l.orderNumber,
      referenceNumber: l.referenceNumber,
      packageNumber: l.packageNumber,
      shipDate: l.shipDate,
      country: l.country ?? "",
      sku: l.sku,
      name: l.name,
      kgPerUnit: l.kgPerUnit!,
      quantity: l.quantity,
      grams: l.grams!,
      kind: "regular" as const,
    }));

  for (const o of overrides) {
    if (o.action !== "add_position") continue;
    applied.add(o.id);
    positions.push({ ...o.position, grams: o.position.quantity * kgToGrams(o.position.kgPerUnit) });
  }

  positions.sort((a, b) =>
    a.shipDate === b.shipDate ? a.orderNumber.localeCompare(b.orderNumber) : a.shipDate.localeCompare(b.shipDate),
  );

  const grams = positions.reduce((s, p) => s + p.grams, 0);
  const totals: RunTotals = {
    grams,
    taxCents: taxCents(grams, rateCentsPerKg),
    orders: new Set(positions.filter((p) => p.kind === "regular").map((p) => p.orderNumber)).size,
    positions: positions.filter((p) => p.kind === "regular").length,
  };

  return { lines, positions, totals, appliedOverrides: overrides.filter((o) => applied.has(o.id)) };
}

/** Tab 1: Summe je Basis-SKU (reguläre Zeilen), Nachmeldungen/Korrekturen als eigene Zeilen. */
export type SkuRow = {
  sku: string;
  name: string;
  kgPerUnit: number;
  quantity: number;
  grams: number;
  label?: string;
};

export function aggregateBySku(positions: Position[]): SkuRow[] {
  const regular = new Map<string, SkuRow>();
  const extra: SkuRow[] = [];
  for (const p of positions) {
    if (p.kind !== "regular") {
      extra.push({ sku: p.sku, name: p.label ?? p.name, kgPerUnit: p.kgPerUnit, quantity: p.quantity, grams: p.grams, label: p.label });
      continue;
    }
    const key = baseSku(p.sku);
    const row = regular.get(key) ?? { sku: key, name: p.name, kgPerUnit: p.kgPerUnit, quantity: 0, grams: 0 };
    if (row.kgPerUnit !== p.kgPerUnit) throw new Error(`Uneinheitliches Gewicht für ${key}`);
    row.quantity += p.quantity;
    row.grams += p.grams;
    regular.set(key, row);
  }
  const rows = [...regular.values()].sort((a, b) => b.grams - a.grams || a.sku.localeCompare(b.sku));
  return [...rows, ...extra];
}
