// Zoho-Anbindung (Org 20100541307, gemeinsame Org mit der Social Ecosystems AG).
//
// Zielweg (Briefing 3.1): Inventory-API, GET /api/v1/reports/shipmentbyitem
// (filter_by=ShipmentDate.CustomDate) und je Paket /api/v1/packages/{id} für
// Lieferadresse und Auftragsnummer. Zoho drosselt parallele Abfragen, deshalb
// strikt sequenziell mit Retry.
//
// Übergangsweg (Lauf September 2026): Books-Connector ohne Paketdaten. Je
// Auftrag ein Paket, Versanddatum = delivery_date, sonst Abschlussdatum
// (last_modified bei manuell geschlossenen Aufträgen, z. B. Paletten). Genau
// so ist die August-Liste entstanden (Regressionstest).
import type { SourceOrder, SourceSnapshot } from "./types.ts";

export const ZOHO_ORG_ID = "20100541307";

// ---------------------------------------------------------------------------
// Normalisierung Books-Auftragsdetail -> SourceOrder

export type BooksListRow = {
  salesorder_id: string;
  salesorder_number: string;
  delivery_date?: string;
  last_modified_time: string;
  shipped_status: string;
  order_status: string;
  status: string;
  date: string;
  customer_name: string;
};

export type BooksDetail = {
  salesorder_id: string;
  salesorder_number: string;
  reference_number: string;
  date: string;
  customer_name: string;
  shipped_status: string;
  ship: {
    company_name?: string;
    attention?: string;
    address?: string;
    street2?: string;
    zip?: string;
    city?: string;
    country: string;
    country_code: string;
  };
  lines: {
    sku: string;
    name: string;
    quantity: number;
    is_combo_product?: boolean;
    mapped_items?: { sku: string; quantity: number }[];
  }[];
};

/** Empfänger-Kennung für die Paletten-Prüfung: GLN, sonst PLZ + Straße. */
export function recipientKey(ship: BooksDetail["ship"]): string {
  const gln = `${ship.company_name ?? ""} ${ship.address ?? ""} ${ship.street2 ?? ""}`.match(/GLN:?\s*(\d{13})/);
  if (gln) return `GLN:${gln[1]}`;
  const norm = (s?: string) => (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  return `ADR:${norm(ship.zip)}|${norm(ship.address)}`;
}

export function shipDateFromList(row: BooksListRow): { date: string; source: "delivery_date" | "closed_date" } {
  if (row.delivery_date) return { date: row.delivery_date, source: "delivery_date" };
  return { date: row.last_modified_time.slice(0, 10), source: "closed_date" };
}

export function booksToSnapshot(list: BooksListRow[], details: BooksDetail[], fetchedAt: string): SourceSnapshot {
  const byId = new Map(list.map((r) => [r.salesorder_id, r]));
  const orders: SourceOrder[] = details.map((d) => {
    const row = byId.get(d.salesorder_id);
    if (!row) throw new Error(`Auftrag ${d.salesorder_number} fehlt in der Liste`);
    const ship = shipDateFromList(row);
    return {
      orderId: d.salesorder_id,
      orderNumber: d.salesorder_number,
      referenceNumber: d.reference_number ?? "",
      orderDate: d.date,
      customerName: d.customer_name,
      shippedStatus: d.shipped_status,
      country: { name: d.ship.country ?? "", code: d.ship.country_code ?? "" },
      recipientKey: recipientKey(d.ship),
      packages: [
        {
          packageNumber: "",
          shipDate: ship.date,
          shipDateSource: ship.source,
          lines: d.lines.map((l) => ({
            sku: l.sku,
            name: l.name,
            quantity: l.quantity,
            isCombo: Boolean(l.is_combo_product),
            // Zoho liefert mapped_items als Gesamtmenge der Zeile -> je Kit umrechnen
            components: l.mapped_items?.length
              ? l.mapped_items.map((m) => ({ sku: m.sku, quantity: m.quantity / l.quantity }))
              : undefined,
          })),
        },
      ],
    };
  });
  return { source: "zoho-books-salesorders", componentsListedSeparately: false, fetchedAt, orders };
}

// ---------------------------------------------------------------------------
// Inventory-Client (Zielweg). Sequenziell, mit Retry bei Drosselung.

export type ZohoAuth = { accessToken: () => Promise<string>; apiBase?: string };

async function zohoGet(auth: ZohoAuth, path: string, params: Record<string, string>): Promise<any> {
  const base = auth.apiBase ?? "https://www.zohoapis.eu/inventory";
  const url = new URL(`${base}${path}`);
  url.searchParams.set("organization_id", ZOHO_ORG_ID);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${await auth.accessToken()}` } });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
      continue;
    }
    throw new Error(`Zoho ${path}: HTTP ${res.status} ${await res.text()}`);
  }
}

/** Pakete mit Versanddatum im Zeitraum, inkl. Lieferadresse je Paket. */
export async function fetchShipmentsByItem(
  auth: ZohoAuth,
  range: { from: string; to: string },
): Promise<SourceSnapshot> {
  const rows: { sku: string; shipment_date: string; quantity_packed: number; package_number: string; package_id: string; item_name: string }[] = [];
  for (let page = 1; ; page++) {
    const r = await zohoGet(auth, "/api/v1/reports/shipmentbyitem", {
      filter_by: "ShipmentDate.CustomDate",
      from_date: range.from,
      to_date: range.to,
      per_page: "500",
      page: String(page),
    });
    rows.push(...(r.shipmentbyitem ?? r.items ?? []));
    if (!r.page_context?.has_more_page) break;
  }
  const byPackage = new Map<string, typeof rows>();
  for (const row of rows) byPackage.set(row.package_id, [...(byPackage.get(row.package_id) ?? []), row]);

  const orders = new Map<string, SourceOrder>();
  for (const [packageId, items] of byPackage) {
    const { package: pkg } = await zohoGet(auth, `/api/v1/packages/${packageId}`, {});
    const so: SourceOrder = orders.get(pkg.salesorder_id) ?? {
      orderId: pkg.salesorder_id,
      orderNumber: pkg.salesorder_number,
      referenceNumber: pkg.reference_number ?? "",
      orderDate: pkg.salesorder_date ?? pkg.date,
      customerName: pkg.customer_name,
      shippedStatus: pkg.shipment_order?.status ?? pkg.status,
      country: { name: pkg.shipping_address?.country ?? "", code: pkg.shipping_address?.country_code ?? "" },
      recipientKey: recipientKey(pkg.shipping_address ?? { country: "", country_code: "" }),
      packages: [],
    };
    so.packages.push({
      packageNumber: pkg.package_number,
      shipDate: items[0].shipment_date,
      shipDateSource: "package",
      lines: items.map((i) => ({ sku: i.sku, name: i.item_name, quantity: Number(i.quantity_packed) })),
    });
    orders.set(so.orderId, so);
  }
  return {
    source: "zoho-inventory-packages",
    componentsListedSeparately: true,
    fetchedAt: new Date().toISOString(),
    orders: [...orders.values()],
  };
}
