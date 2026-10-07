// Nachbearbeitung des FMS-PDFs: Menge in kg auf Seite 5 (1808, Zeile 1.1).
// Der Formularserver hat dafür kein Feld mehr.
//
// Unterschrift: bewusst NICHT automatisiert. Das Einsetzen der Unterschrift
// bleibt ein Schritt von Marcel (oder eine eigene, ausdrücklich freigegebene
// Erweiterung mit verschlüsselt abgelegtem Asset, das nie im Repo liegt).
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatKgDe } from "./units.ts";

/** Position laut eingereichten Meldungen: rechtsbündig x = 356 pt, Grundlinie 220,5 pt von oben. */
export const KG_FIELD = { page: 4, rightX: 356, baselineFromTop: 220.5, size: 10 };

export async function stampKg(pdfBytes: Uint8Array, grams: number): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const pages = doc.getPages();
  if (pages.length < KG_FIELD.page + 1) throw new Error(`PDF hat ${pages.length} Seiten, 1808 (Seite 5) fehlt`);
  const page = pages[KG_FIELD.page];
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = formatKgDe(grams);
  const width = font.widthOfTextAtSize(text, KG_FIELD.size);
  page.drawText(text, {
    x: KG_FIELD.rightX - width,
    y: page.getHeight() - KG_FIELD.baselineFromTop,
    size: KG_FIELD.size,
    font,
    color: rgb(0, 0, 0),
  });
  return doc.save({ useObjectStreams: false });
}
