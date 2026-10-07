import { test } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { inflateSync } from "node:zlib";
import { KG_FIELD, stampKg } from "../src/pdf.ts";

async function fivePages(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < 5; i++) doc.addPage([595.28, 841.89]);
  return doc.save();
}

test("Menge in kg rechtsbündig auf Seite 5 (1808, Zeile 1.1)", async () => {
  const out = await stampKg(await fivePages(), 1_234_560);
  const doc = await PDFDocument.load(out);
  assert.equal(doc.getPageCount(), 5);
  const page = doc.getPages()[KG_FIELD.page];
  const raw = page.node.Contents();
  assert.ok(raw, "Seite 5 hat Inhalt");
  const streams = "asArray" in raw ? raw.asArray() : [raw];
  const content = streams
    .map((s) => {
      const obj = doc.context.lookup(s) as unknown as { getContents(): Uint8Array };
      const bytes = obj.getContents();
      try {
        return inflateSync(bytes).toString("latin1");
      } catch {
        return Buffer.from(bytes).toString("latin1");
      }
    })
    .join("\n");
  const hex = Buffer.from("1.234,560", "latin1").toString("hex").toUpperCase();
  assert.ok(content.includes(hex), "Text 1.234,560 im Content-Stream");
  // rechtsbündig: x = 356 − Textbreite, Grundlinie = Höhe − 220,5
  const font = await (await PDFDocument.create()).embedFont(StandardFonts.Helvetica);
  const x = (KG_FIELD.rightX - font.widthOfTextAtSize("1.234,560", KG_FIELD.size)).toString();
  assert.ok(content.includes(`${x.slice(0, 6)}`), `x-Position ${x}`);
  assert.ok(content.includes("621.39"), "Grundlinie 621,39 pt von unten");
});

test("PDF ohne Seite 5 wird abgelehnt", async () => {
  const doc = await PDFDocument.create();
  doc.addPage();
  await assert.rejects(stampKg(await doc.save(), 1000), /Seite 5/);
});
