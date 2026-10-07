// Vorlage aus FMS-Druck: Blanko erzeugen und mit den Originalwerten wieder füllen
// muss Wort für Wort und Position für Position den Druck ergeben. Der FMS-Druck
// enthält Stammdaten und liegt nur in private/ (Test sonst übersprungen).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fillTemplate, readTemplate } from "../src/fms-template.ts";

const src = new URL("../private/templates/fms_druck_2026-10-07_august.pdf", import.meta.url);
const golden = new URL("../private/templates/fms_druck_2026-10-07_august.values.json", import.meta.url);

test("Vorlage: Blanko + Werte = FMS-Druck", { skip: !existsSync(src) || !existsSync(golden) }, async () => {
  const values = JSON.parse(readFileSync(golden, "utf8"));
  const original = new Uint8Array(readFileSync(src));
  const empty = Object.fromEntries(Object.keys(values).map((k) => [k, ""]));
  const blank = await fillTemplate(original, { ...empty, sonstiges: "" }, "Test");
  const b = await readTemplate(blank);
  for (const k of Object.keys(values)) assert.equal(b.fields[k as keyof typeof b.fields], "", `Blanko: ${k} leer`);
  const refilled = await readTemplate(await fillTemplate(blank, values, "Test"));
  for (const [k, v] of Object.entries(values)) assert.equal(refilled.fields[k as keyof typeof refilled.fields], v, k);
  // alle übrigen Textblöcke (Stammdaten, Kreuze, Beschriftungen) unverändert
  const orig = await readTemplate(original);
  for (const p of Object.keys(orig.pages)) {
    const a = orig.pages[Number(p)];
    const r = refilled.pages[Number(p)];
    assert.equal(r.length, a.length);
    const diff = a.map((t, i) => [i, t, r[i]] as const).filter(([, t, x]) => t !== x);
    // einzige Abweichung: „Sonstiges“ (Seite 3, Block 8) bleibt leer
    assert.deepEqual(diff.map(([i]) => `${p}:${i}`), Number(p) === 2 ? ["2:8"] : []);
  }
});

test("Vorlage: unbekannte Datei wird abgelehnt", async () => {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  for (let i = 0; i < 5; i++) doc.addPage();
  await assert.rejects(fillTemplate(await doc.save(), { monat: "September" }, "Test"));
});
