import { test } from "node:test";
import assert from "node:assert/strict";
import { formatEuroDe, formatEuroPlain, formatKgDe, kgToGrams, taxCents } from "../src/units.ts";
import { ampel, dueDate, formatRkz, laufendeNummer, registrierkennzeichen, sendBy } from "../src/calendar.ts";
import { normalizeCountry } from "../src/country.ts";

test("Steuer = ROUND(kg × 2,19; 2), exakt in Cent", () => {
  assert.equal(taxCents(1_234_560, 219), 270_369); // 2.703,6864 -> 2.703,69
  assert.equal(taxCents(1_000_000, 219), 219_000);
  assert.equal(taxCents(2_283_105, 219), 500_000); // 4.999,99995 -> 5.000,00 (half up)
  assert.equal(taxCents(350, 219), 77); // 0,35 kg -> 0,7665 -> 0,77
  assert.equal(taxCents(5_600, 219), 1_226); // 12,264 -> 12,26
});

test("Formate wie im Formular", () => {
  assert.equal(formatKgDe(1_234_560), "1.234,560");
  assert.equal(formatKgDe(350), "0,350");
  assert.equal(formatEuroDe(270_369), "2.703,69");
  assert.equal(formatEuroPlain(270_369), "2703.69");
  assert.equal(kgToGrams(0.35), 350);
  assert.equal(kgToGrams(1.05), 1050);
  assert.equal(kgToGrams(2.8), 2800);
});

test("Registrierkennzeichen: lfd. Nr. zählt monatlich ab Sep 2025 = 0001", () => {
  const cases: [number, number, string][] = [
    [2025, 9, "0001"],
    [2025, 10, "0002"],
    [2025, 11, "0003"],
    [2026, 1, "0005"],
    [2026, 2, "0006"], // bestätigt durch Mahnung HZA Stuttgart
    [2026, 3, "0007"],
    [2026, 4, "0008"],
    [2026, 7, "0011"],
    [2026, 8, "0012"],
    [2026, 9, "0013"],
    [2027, 1, "0017"],
  ];
  for (const [year, month, lfd] of cases) assert.equal(laufendeNummer({ year, month }), lfd, `${year}-${month}`);
  const rkz = registrierkennzeichen({ year: 2026, month: 9 }, { unternehmensnummer: "123456", dienststelle: "9999" });
  assert.equal(formatRkz(rkz), "TKA-0013-123456-09-2026-9999");
});

test("Fälligkeit 10. des Folgemonats, Versand bei Wochenende am Freitag davor", () => {
  const sep = { year: 2026, month: 9 };
  assert.equal(dueDate(sep), "2026-10-10");
  assert.equal(sendBy(sep), "2026-10-09"); // 10.10.2026 ist ein Samstag
  assert.equal(ampel(sep, "2026-10-04", false), "grün");
  assert.equal(ampel(sep, "2026-10-07", false), "gelb");
  assert.equal(ampel(sep, "2026-10-08", false), "rot");
  assert.equal(ampel(sep, "2026-10-08", true), "grün");
});

test("Länderfeld normalisieren; Unbekanntes ist ein Blocker", () => {
  for (const [name, code] of [
    ["Germany", "DE"],
    ["Deutschland", "Deutschland"], // SO-00941 (August-Lücke)
    ["deutschland", ""],
    ["", "GER"],
    ["DE", "DE"],
  ]) {
    assert.deepEqual(normalizeCountry({ name, code }), { ok: true, code: "DE" }, `${name}|${code}`);
  }
  assert.deepEqual(normalizeCountry({ name: "Switzerland", code: "CH" }), { ok: true, code: "CH" });
  assert.equal(normalizeCountry({ name: "", code: "" }).ok, false); // SO-00987: Land leer
  assert.equal(normalizeCountry({ name: "Austria", code: "DE" }).ok, false); // widersprüchlich
  assert.equal(normalizeCountry({ name: "Atlantis", code: "" }).ok, false);
});
