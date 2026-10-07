// Monats-Sheet mit zwei Tabs (Briefing 4 (2)). Formeln statt fester Werte;
// die berechneten Werte werden als Cache mitgeschrieben, damit die .xlsx auch
// ohne Neuberechnung korrekt angezeigt wird. Keine Kundenspalte.
import ExcelJS from "exceljs";
import { monthRange } from "./calendar.ts";
import type { SkuRow } from "./compute.ts";
import type { Position, YearMonth } from "./types.ts";
import { MONTH_NAMES_DE, gramsToKg, isoToDe, taxCents } from "./units.ts";

export type SheetInput = {
  ym: YearMonth;
  firma: string;
  rateCentsPerKg: number;
  skuRows: SkuRow[];
  positions: Position[];
  packageNumbersAvailable: boolean;
};

export function sheetName(ym: YearMonth): string {
  return `Kaffeesteuer_${MONTH_NAMES_DE[ym.month - 1]}_${ym.year}`;
}

const KG = "#,##0.000";
const EUR = "#,##0.00";

export async function buildSheet(i: SheetInput): Promise<{ xlsx: Uint8Array; tab1Grams: number; tab2Grams: number; taxCents: number }> {
  const monat = MONTH_NAMES_DE[i.ym.month - 1];
  const { from, to } = monthRange(i.ym);
  const wb = new ExcelJS.Workbook();
  wb.creator = "Borderhaus Kaffeesteuer";

  // ---------------- Tab 1
  const t1Name = `Kaffeesteuer ${monat}`;
  const t1 = wb.addWorksheet(t1Name);
  t1.columns = [{ width: 22 }, { width: 70 }, { width: 12 }, { width: 14 }, { width: 30 }, { width: 20 }];
  t1.getCell("A1").value = `Kaffeesteuer ${monat} ${i.ym.year} - ${i.firma}`;
  t1.getCell("A1").font = { bold: true, size: 13 };
  t1.getCell("A2").value = `Röstkaffee, Versand aus NL nach Deutschland, Versanddatum ${isoToDe(from).slice(0, 6)}-${isoToDe(to)}`;
  t1.getCell("E4").value = "Steuersatz Röstkaffee (EUR/kg)";
  t1.getCell("F4").value = i.rateCentsPerKg / 100;
  t1.getCell("F4").numFmt = EUR;
  const hdr = ["SKU", "Artikel", "KG/Einheit", "Gesamt Menge", "Gesamt KG", "Kaffeesteuer (EUR)"];
  t1.getRow(6).values = hdr;
  t1.getRow(6).font = { bold: true };

  let r = 7;
  let tab1Grams = 0;
  for (const row of i.skuRows) {
    const kg = gramsToKg(row.grams);
    t1.getRow(r).values = [row.sku, row.label ? `${row.label}` : row.name, row.kgPerUnit, row.quantity];
    t1.getCell(`E${r}`).value = { formula: `C${r}*D${r}`, result: kg };
    t1.getCell(`F${r}`).value = { formula: `ROUND(E${r}*$F$4,2)`, result: taxCents(row.grams, i.rateCentsPerKg) / 100 };
    t1.getCell(`E${r}`).numFmt = KG;
    t1.getCell(`F${r}`).numFmt = EUR;
    if (row.label) t1.getRow(r).font = { italic: true };
    tab1Grams += row.grams;
    r++;
  }
  const first = 7;
  const last = r - 1;
  const totalTax = taxCents(tab1Grams, i.rateCentsPerKg);
  const totalQty = i.skuRows.reduce((s, x) => s + x.quantity, 0);
  t1.getCell(`A${r}`).value = "GESAMT";
  t1.getCell(`D${r}`).value = { formula: `SUM(D${first}:D${last})`, result: totalQty };
  t1.getCell(`E${r}`).value = { formula: `SUM(E${first}:E${last})`, result: gramsToKg(tab1Grams) };
  // Steuer = ROUND(Gesamt-kg × Satz; 2), identisch mit steuerb1b/summe/gesamt der 1808
  t1.getCell(`F${r}`).value = { formula: `ROUND(E${r}*$F$4,2)`, result: totalTax / 100 };
  t1.getCell(`E${r}`).numFmt = KG;
  t1.getCell(`F${r}`).numFmt = EUR;
  t1.getRow(r).font = { bold: true };
  const t1TotalCell = `E${r}`;

  // ---------------- Tab 2
  const t2 = wb.addWorksheet("Versendete Bestellungen");
  t2.columns = [
    { width: 16 }, { width: 18 }, { width: 14 }, { width: 13 }, { width: 6 },
    { width: 20 }, { width: 70 }, { width: 11 }, { width: 8 }, { width: 11 },
  ];
  t2.getCell("A1").value = `Versendete Bestellungen ${monat} ${i.ym.year} - ${i.firma}`;
  t2.getCell("A1").font = { bold: true, size: 13 };
  t2.getCell("A2").value =
    `Röstkaffee, Lieferadresse Deutschland, Versanddatum ${isoToDe(from).slice(0, 6)}-${isoToDe(to)} ` +
    `(Quelle: Zoho, Org 20100541307${i.packageNumbersAvailable ? "" : "; Versanddatum = Abschluss-/Lieferdatum des Auftrags, Paketnummern nicht verfügbar"})`;
  t2.getRow(3).values = ["Bestellnummer", "Referenz", "Paketnummer", "Versanddatum", "Land", "SKU", "Artikel", "KG/Einheit", "Menge", "Gesamt KG"];
  t2.getRow(3).font = { bold: true };
  let q = 4;
  let tab2Grams = 0;
  for (const p of i.positions) {
    t2.getRow(q).values = [
      p.orderNumber,
      p.referenceNumber,
      p.packageNumber || "",
      p.shipDate,
      p.country,
      p.sku,
      p.kind === "regular" ? p.name : `${p.label ?? p.kind}`,
      p.kgPerUnit,
      p.quantity,
    ];
    t2.getCell(`J${q}`).value = { formula: `H${q}*I${q}`, result: gramsToKg(p.grams) };
    t2.getCell(`J${q}`).numFmt = KG;
    if (p.kind !== "regular") t2.getRow(q).font = { italic: true };
    tab2Grams += p.grams;
    q++;
  }
  t2.getCell(`A${q}`).value = "SUMME";
  t2.getCell(`I${q}`).value = { formula: `SUM(I4:I${q - 1})`, result: i.positions.reduce((s, p) => s + p.quantity, 0) };
  t2.getCell(`J${q}`).value = { formula: `SUM(J4:J${q - 1})`, result: gramsToKg(tab2Grams) };
  t2.getCell(`J${q}`).numFmt = KG;
  t2.getRow(q).font = { bold: true };
  t2.getCell(`G${q + 1}`).value = "Abgleich mit Tab 1 (Differenz muss 0 sein)";
  t2.getCell(`J${q + 1}`).value = { formula: `ROUND(J${q}-'${t1Name}'!${t1TotalCell},3)`, result: gramsToKg(tab2Grams - tab1Grams) };

  const buf = await wb.xlsx.writeBuffer();
  return { xlsx: new Uint8Array(buf as ArrayBuffer), tab1Grams, tab2Grams, taxCents: totalTax };
}
