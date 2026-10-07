import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { REFERENCE_CROSSES, crossesFromXml, datasetXml, fmsErrors, formFields, hiddenFields } from "../src/fms1807.ts";
import { registrierkennzeichen } from "../src/calendar.ts";
import { recipients, subject, body } from "../src/email.ts";

const example = JSON.parse(readFileSync(new URL("../config.example.json", import.meta.url), "utf8"));
const aug = { year: 2026, month: 8 };

test("Golden File: XML-Datensatz entspricht byte-genau dem FMS-Export August 2026 (anonymisiert)", () => {
  const golden = readFileSync(new URL("./golden/1807-dataset-august-2026.xml", import.meta.url), "utf8");
  const xml = datasetXml({
    ym: aug,
    rkz: registrierkennzeichen(aug, example.stamm),
    taxCents: 123_456,
    sonstiges: "Nachmeldung Beispiel 1 kg. Details siehe Anlage.",
    datum: "2026-10-07",
    stamm: example.stamm,
  });
  assert.equal(xml, golden);
});

const privateGolden = new URL("../private/golden_aug_2026_fms.xml", import.meta.url);
const privateConfig = new URL("../private/config.json", import.meta.url);
const privateInput = new URL("../private/golden_aug_2026_input.json", import.meta.url);
const hasPrivate = [privateGolden, privateConfig, privateInput].every((u) => existsSync(u));
test("Golden File (privat): echter FMS-Export August 2026", { skip: !hasPrivate }, () => {
  const cfg = JSON.parse(readFileSync(privateConfig, "utf8"));
  const input = JSON.parse(readFileSync(privateInput, "utf8"));
  const xml = datasetXml({ ym: aug, rkz: registrierkennzeichen(aug, cfg.stamm), stamm: cfg.stamm, ...input });
  assert.equal(xml, readFileSync(privateGolden, "utf8"));
});

test("Feldbelegung 1807/1808 für den Formularserver", () => {
  const sep = { year: 2026, month: 9 };
  const f = formFields({
    ym: sep,
    rkz: registrierkennzeichen(sep, example.stamm),
    taxCents: 270_369,
    sonstiges: "",
    datum: "2026-10-07",
    stamm: example.stamm,
  });
  const golden = JSON.parse(readFileSync(new URL("./golden/1807-fields-september-2026.json", import.meta.url), "utf8"));
  assert.deepEqual(f, golden);
  for (const [k, v] of Object.entries(REFERENCE_CROSSES)) assert.equal(f[k], v, k);
  assert.equal(f.gruendung_sb, "");
  assert.equal(f.a1807_mon_steueranmeldung, "September");
  assert.equal(f.a1807_registrierkennzeichen, "0013");
  assert.throws(() =>
    formFields({ ym: sep, rkz: registrierkennzeichen(sep, example.stamm), taxCents: 1, sonstiges: "x".repeat(121), datum: "2026-10-07", stamm: example.stamm }),
  );
});

test("Kreuze aus dem FMS-Export entsprechen dem Referenzsatz", () => {
  const golden = readFileSync(new URL("./golden/1807-dataset-august-2026.xml", import.meta.url), "utf8");
  assert.deepEqual(crossesFromXml(golden), REFERENCE_CROSSES);
});

test("FMS-HTML: hidden fields und Fehlerliste", () => {
  const html =
    '<form><input type="hidden" name="$context" value="abc"/><input type="hidden" name="$csrf" value="x&amp;y"/></form>' +
    "<div>Fehler aufgetreten<ul><li>Feld <b>Monat</b> fehlt</li><li>Betrag ungültig</li></ul></div>";
  assert.deepEqual(hiddenFields(html), { $context: "abc", $csrf: "x&y" });
  assert.deepEqual(fmsErrors(html), ["Feld Monat fehlt", "Betrag ungültig"]);
});

test("HZA-Mail: BCC nur bei den ersten 5 Läufen, Betreff mit Registrierkennzeichen", () => {
  const cfg = example.mail;
  assert.deepEqual(recipients(cfg, 1).bcc, ["buchhaltung@example.com", "kontrolle@example.com"]);
  assert.deepEqual(recipients(cfg, 5).bcc, ["buchhaltung@example.com", "kontrolle@example.com"]);
  assert.deepEqual(recipients(cfg, 6).bcc, ["buchhaltung@example.com"]);
  assert.deepEqual(recipients(cfg, 6, true).bcc, ["buchhaltung@example.com", "kontrolle@example.com"]);
  const sep = { year: 2026, month: 9 };
  const rkz = registrierkennzeichen(sep, example.stamm);
  assert.equal(subject(cfg, sep, rkz), "Kaffeesteuer-Anmeldung September 2026 – Beispiel GmbH – TKA-0013-000000-09-2026-0000");
  assert.match(body(cfg, sep, rkz, 1_234_560, 270_369), /Angemeldete Menge Röstkaffee: 1\.234,560 kg, Steuerbetrag: 2\.703,69 €/);
});
