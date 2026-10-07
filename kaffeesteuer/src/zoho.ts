// Zoho-Anbindung (Org 20100541307, gemeinsame Org mit der Social Ecosystems AG).
//
// Zielweg (Briefing 3.1): Inventory-API mit Paketen. Paketliste, je Paket das
// Detail (Versanddatum, Inhalt, Lieferadresse) und je Auftrag die Auftragszeilen
// (Bestellmenge, Kit-Aufbau, Länderkennzeichen). Zoho drosselt parallele
// Abfragen, deshalb strikt sequenziell mit Retry.
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
// Inventory (Zielweg): Pakete statt Aufträge. Gezählt wird jedes Paket mit
// Status shipped/delivered und Versanddatum im Monat, mit genau dem Inhalt,
// der im Paket war. Teillieferungen ergeben sich damit von selbst: jedes
// Paket zählt in dem Monat, in dem es rausging.

type InvAddress = BooksDetail["ship"] & { country_code?: string };

export type InvPackage = {
  package_id: string;
  package_number: string;
  salesorder_id: string;
  salesorder_number?: string;
  date: string;
  status: string; // not_shipped | shipped | delivered
  shipment_date?: string;
  shipment_order?: { shipment_number?: string; shipment_date?: string; tracking_number?: string; carrier?: string };
  shipping_address?: InvAddress;
  line_items: { so_line_item_id?: string; sku: string; name: string; quantity: number }[];
};

export type InvSalesOrder = {
  salesorder_id: string;
  salesorder_number: string;
  reference_number?: string;
  date: string;
  customer_name: string;
  shipped_status: string;
  shipping_address: InvAddress;
  line_items: {
    line_item_id: string;
    sku: string;
    name: string;
    quantity: number;
    is_combo_product?: boolean;
    mapped_items?: { line_item_id: string; sku: string; name: string; quantity: number; mapped_quantity?: number }[];
  }[];
};

const SHIPPED = new Set(["shipped", "delivered"]);

export function packageShipDate(p: InvPackage): string {
  return (p.shipment_order?.shipment_date || p.shipment_date || "").slice(0, 10);
}

/** Pakete + zugehörige Aufträge -> Snapshot. Nur versendete Pakete im Zeitraum. */
export function inventoryToSnapshot(
  packages: InvPackage[],
  salesorders: InvSalesOrder[],
  range: { from: string; to: string },
  fetchedAt: string,
): SourceSnapshot {
  const soById = new Map(salesorders.map((s) => [s.salesorder_id, s]));
  const orders = new Map<string, SourceOrder>();
  for (const p of packages) {
    const shipDate = packageShipDate(p);
    if (!SHIPPED.has(p.status) || !shipDate || shipDate < range.from || shipDate > range.to) continue;
    const so = soById.get(p.salesorder_id);
    if (!so) throw new Error(`Paket ${p.package_number}: Auftrag ${p.salesorder_number ?? p.salesorder_id} fehlt`);

    // Auftragszeilen nach line_item_id, Kit-Komponenten mit Verweis auf das Kit
    const soLines = new Map<string, { sku: string; name: string; ordered: number; isCombo: boolean; components?: { sku: string; quantity: number }[] }>();
    for (const l of so.line_items) {
      const components = l.mapped_items?.length
        ? l.mapped_items.map((m) => ({ sku: m.sku, quantity: m.mapped_quantity ?? m.quantity / l.quantity }))
        : undefined;
      soLines.set(l.line_item_id, { sku: l.sku, name: l.name, ordered: l.quantity, isCombo: Boolean(l.is_combo_product), components });
      for (const m of l.mapped_items ?? []) soLines.set(m.line_item_id, { sku: m.sku, name: m.name, ordered: m.quantity, isCombo: false });
    }

    const addr = p.shipping_address?.country || p.shipping_address?.country_code ? p.shipping_address! : so.shipping_address;
    const order: SourceOrder = orders.get(so.salesorder_id) ?? {
      orderId: so.salesorder_id,
      orderNumber: so.salesorder_number,
      referenceNumber: so.reference_number ?? "",
      orderDate: so.date,
      customerName: so.customer_name,
      shippedStatus: so.shipped_status,
      country: { name: addr.country ?? "", code: addr.country_code ?? "" },
      recipientKey: recipientKey(addr),
      packages: [],
    };
    order.packages.push({
      packageNumber: p.package_number,
      shipDate,
      shipDateSource: "package",
      lines: p.line_items.map((pl) => {
        const sl = pl.so_line_item_id ? soLines.get(pl.so_line_item_id) : undefined;
        return {
          sku: pl.sku || sl?.sku || "",
          name: pl.name || sl?.name || "",
          quantity: Number(pl.quantity),
          isCombo: sl?.isCombo,
          components: sl?.components,
          orderedQuantity: sl?.ordered,
        };
      }),
    });
    orders.set(so.salesorder_id, order);
  }
  // Kit-Inhalte können im Paket zusätzlich als Einzelzeilen stehen; compute.ts zieht sie dann ab.
  return { source: "zoho-inventory-packages", componentsListedSeparately: true, fetchedAt, orders: [...orders.values()] };
}

export type ZohoAuth = { accessToken: () => Promise<string>; apiBase?: string };

/**
 * OAuth über Refresh-Token (Self Client in der Zoho API Console, Rechenzentrum EU).
 * Scopes: ZohoInventory.packages.READ,ZohoInventory.salesorders.READ
 * Variablen: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_INVENTORY_REFRESH_TOKEN, ZOHO_DC_REGION (eu)
 */
export function refreshTokenAuth(env: Record<string, string | undefined> = process.env): ZohoAuth {
  const region = (env.ZOHO_DC_REGION || "eu").toLowerCase();
  const need = ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_INVENTORY_REFRESH_TOKEN"].filter((k) => !env[k]);
  if (need.length) throw new Error(`Zoho-Zugang fehlt: ${need.join(", ")}`);
  let token: { value: string; until: number } | null = null;
  return {
    apiBase: `https://www.zohoapis.${region}/inventory`,
    accessToken: async () => {
      if (token && Date.now() < token.until) return token.value;
      const res = await fetch(`https://accounts.zoho.${region}/oauth/v2/token`, {
        method: "POST",
        body: new URLSearchParams({
          refresh_token: env.ZOHO_INVENTORY_REFRESH_TOKEN!,
          client_id: env.ZOHO_CLIENT_ID!,
          client_secret: env.ZOHO_CLIENT_SECRET!,
          grant_type: "refresh_token",
        }),
      });
      const text = await res.text();
      let j: { access_token?: string; expires_in?: number; error?: string } = {};
      try {
        j = JSON.parse(text);
      } catch {
        throw new Error(`Zoho-Token: HTTP ${res.status} ${text.slice(0, 120)} (Netzzugang zu accounts.zoho.${region} freigegeben?)`);
      }
      if (!j.access_token) throw new Error(`Zoho-Token: ${j.error ?? `HTTP ${res.status}`}`);
      token = { value: j.access_token, until: Date.now() + ((j.expires_in ?? 3600) - 120) * 1000 };
      return token.value;
    },
  };
}

async function zohoGet(auth: ZohoAuth, path: string, params: Record<string, string>): Promise<any> {
  const base = auth.apiBase ?? "https://www.zohoapis.eu/inventory";
  const url = new URL(`${base}${path}`);
  url.searchParams.set("organization_id", ZOHO_ORG_ID);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  for (let attempt = 0; ; attempt++) {
    await new Promise((r) => setTimeout(r, 700)); // unter der Minutengrenze bleiben
    const res = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${await auth.accessToken()}` } });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
      continue;
    }
    throw new Error(`Zoho ${path}: HTTP ${res.status} ${await res.text()}`);
  }
}

const addDays = (iso: string, d: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + d * 86_400_000).toISOString().slice(0, 10);

/**
 * Alle Pakete, die im Zeitraum versendet wurden, mit Inhalt und Auftrag.
 * Die Paketliste wird nach Paketdatum absteigend gelesen, bis das Paketdatum
 * mehr als lookbackDays vor dem Zeitraum liegt (Pakete werden vor dem Versand
 * angelegt, ein Paket vom August kann im September rausgehen).
 */
export async function fetchInventoryPackages(
  auth: ZohoAuth,
  range: { from: string; to: string },
  opts: { lookbackDays?: number; log?: (msg: string) => void } = {},
): Promise<{ snapshot: SourceSnapshot; packages: InvPackage[]; salesorders: InvSalesOrder[] }> {
  const log = opts.log ?? (() => {});
  const stopBefore = addDays(range.from, -(opts.lookbackDays ?? 60));
  const candidates: { package_id: string; date: string; shipment_date?: string }[] = [];
  for (let page = 1; ; page++) {
    const r = await zohoGet(auth, "/v1/packages", { page: String(page), per_page: "200", sort_column: "date", sort_order: "D" });
    const rows = (r.packages ?? []) as { package_id: string; date: string; shipment_date?: string }[];
    for (const row of rows) {
      if (row.shipment_date && (row.shipment_date < range.from || row.shipment_date > range.to)) continue;
      if (row.date >= stopBefore && row.date <= range.to) candidates.push(row);
    }
    log(`Paketliste Seite ${page}: ${rows.length} Pakete, ${candidates.length} Kandidaten`);
    if (!r.page_context?.has_more_page || rows.every((x) => x.date < stopBefore)) break;
  }
  const packages: InvPackage[] = [];
  for (const c of candidates) {
    const { package: p } = await zohoGet(auth, `/v1/packages/${c.package_id}`, {});
    const d = packageShipDate(p);
    if (SHIPPED.has(p.status) && d >= range.from && d <= range.to) packages.push(p);
  }
  log(`${packages.length} versendete Pakete im Zeitraum`);
  const salesorders: InvSalesOrder[] = [];
  for (const id of new Set(packages.map((p) => p.salesorder_id))) {
    const { salesorder } = await zohoGet(auth, `/v1/salesorders/${id}`, {});
    salesorders.push(salesorder);
  }
  log(`${salesorders.length} Aufträge geladen`);
  return { snapshot: inventoryToSnapshot(packages, salesorders, range, new Date().toISOString()), packages, salesorders };
}
