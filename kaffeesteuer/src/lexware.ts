// Lexware Office (Coffee Annan GmbH): 1807 als Beleg, Zahlung an HZA Stuttgart vorbereiten.
// Kein automatisches Auslösen der Überweisung; Marcel gibt die Zahlung in Lexware frei.
import { formatRkz, type Registrierkennzeichen } from "./calendar.ts";

const API = "https://api.lexware.io";

export type VoucherInput = {
  rkz: Registrierkennzeichen;
  voucherDate: string; // Anmeldedatum
  dueDate: string; // 10. des Folgemonats
  taxCents: number;
  contactId: string; // Lieferant Hauptzollamt (anlegen bzw. wiederverwenden)
  categoryId: string; // Kaffeesteuer / Verbrauchsteuer (GET /v1/posting-categories)
};

/** Beleg ohne Umsatzsteuer, Betrag = Steuerbetrag, Belegnummer = Registrierkennzeichen. */
export function voucherPayload(v: VoucherInput) {
  const amount = v.taxCents / 100;
  return {
    type: "purchaseinvoice",
    voucherNumber: formatRkz(v.rkz),
    voucherDate: v.voucherDate,
    shippingDate: v.voucherDate,
    dueDate: v.dueDate,
    totalGrossAmount: amount,
    totalTaxAmount: 0,
    taxType: "gross",
    useCollectiveContact: false,
    contactId: v.contactId,
    remark: `Kaffeesteuer ${formatRkz(v.rkz)}`,
    voucherItems: [{ amount, taxAmount: 0, taxRatePercent: 0, categoryId: v.categoryId }],
  };
}

/** Zahlungsdaten: IBAN/Empfänger aus der bestehenden Lexware-Zahlung vom 09.04.2026 übernehmen, nicht raten. */
export function paymentReference(rkz: Registrierkennzeichen): string {
  return formatRkz(rkz);
}

export async function uploadVoucher(apiKey: string, pdf: Uint8Array, fileName: string, v: VoucherInput) {
  const auth = { Authorization: `Bearer ${apiKey}`, Accept: "application/json" };
  const created = await fetch(`${API}/v1/vouchers`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(voucherPayload(v)),
  });
  if (!created.ok) throw new Error(`Lexware voucher: HTTP ${created.status} ${await created.text()}`);
  const { id } = (await created.json()) as { id: string };
  const form = new FormData();
  form.set("file", new Blob([pdf], { type: "application/pdf" }), fileName);
  const up = await fetch(`${API}/v1/vouchers/${id}/files`, { method: "POST", headers: auth, body: form });
  if (!up.ok) throw new Error(`Lexware file: HTTP ${up.status} ${await up.text()}`);
  return id;
}
