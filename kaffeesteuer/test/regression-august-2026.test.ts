// Regressionstest August 2026 aus Zoho gegen die eingereichte Liste (Sollwerte in private/fixtures).
// Die Zoho-Daten enthalten Kunden- und Auftragsdaten und liegen deshalb nur in
// private/fixtures (gitignored). Ohne Fixture wird der Test übersprungen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { booksToSnapshot } from "../src/zoho.ts";
import { computeMonth } from "../src/compute.ts";
import { runChecks } from "../src/checks.ts";
import { DEFAULT_MAPPING, withExclusions } from "../src/sku-mapping.ts";
import { REFERENCE_CROSSES } from "../src/fms1807.ts";
import type { HistoryEntry } from "../src/types.ts";

const dir = new URL("../private/fixtures/", import.meta.url);
const has = ["2026-08/details.jsonl", "2026-08/expected.json", "so_list.json"].every((f) => existsSync(new URL(f, dir)));

test("Regression August 2026: Zoho ergibt Aufträge / Positionen / kg der eingereichten Liste", { skip: !has }, () => {
  const list = JSON.parse(readFileSync(new URL("so_list.json", dir), "utf8"));
  const details = readFileSync(new URL("2026-08/details.jsonl", dir), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const ex = JSON.parse(readFileSync(new URL("../data/sku-exclusions.json", import.meta.url), "utf8"));
  const mapping = withExclusions(DEFAULT_MAPPING, ex.exclusions, ex);
  const snapshot = booksToSnapshot(list, details, "");
  const ym = { year: 2026, month: 8 };

  // Historie: Juni-Teil von SO-00941 (Teillieferung) und SO-00959 (Juli-Liste)
  const history: HistoryEntry[] = [
    { month: "2026-06", orderNumber: "SO-00941", sku: "CA-R-002_4", quantity: 29, grams: 116_000 },
    { month: "2026-06", orderNumber: "SO-00941", sku: "CA-R-004_4", quantity: 8, grams: 32_000 },
    { month: "2026-07", orderNumber: "SO-00959", sku: "CA-R-002_4", quantity: 6, grams: 24_000 },
  ];
  // Restmengen-Logik: in Vormonaten gemeldete Mengen werden automatisch abgezogen
  const r = computeMonth(ym, snapshot, mapping, [], 219, { history });
  const checks = runChecks({
    ym,
    today: "2026-09-01",
    rateCentsPerKg: 219,
    ids: { unternehmensnummer: "123456", dienststelle: "9999" },
    snapshot,
    result: r,
    history,
    outputs: null,
    form: { rkz: null, crosses: null, referenceCrosses: REFERENCE_CROSSES, fmsErrors: null, pdfPresent: false, signaturePresent: false },
    openItems: [],
    approved: false,
  });
  const dup = checks.find((c) => c.key === "duplicate")!;
  assert.equal(dup.status, "ok", dup.details.join("\n"));
  assert.deepEqual(
    r.lines.filter((l) => l.status === "already-reported").map((l) => `${l.orderNumber}|${l.sku}`).sort(),
    ["SO-00941|CA-R-002_4", "SO-00941|CA-R-004_4", "SO-00959|CA-R-002_4"],
  );
  assert.equal(checks.find((c) => c.key === "sku")!.status, "ok", "alle SKUs eingeordnet");
  assert.equal(checks.find((c) => c.key === "country")!.status, "ok", "Deutschland/Germany/DE erkannt");

  const expected = JSON.parse(readFileSync(new URL("2026-08/expected.json", dir), "utf8"));
  assert.equal(r.totals.orders, expected.orders);
  assert.equal(r.totals.positions, expected.positions);
  assert.equal(r.totals.grams, expected.grams);

  // Positionsgenau gegen die eingereichte August-Liste
  const sheetFile = new URL("2026-08/sheet_list.json", dir);
  if (existsSync(sheetFile)) {
    const sheet = JSON.parse(readFileSync(sheetFile, "utf8")) as HistoryEntry[];
    const key = (o: string, s: string) => `${o}|${s.replace(/_old\d*$/, "")}`;
    const sum = (rows: { orderNumber: string; sku: string; quantity: number }[]) => {
      const m = new Map<string, number>();
      for (const x of rows) m.set(key(x.orderNumber, x.sku), (m.get(key(x.orderNumber, x.sku)) ?? 0) + x.quantity);
      return m;
    };
    assert.deepEqual(sum(r.positions), sum(sheet));
  }
});
