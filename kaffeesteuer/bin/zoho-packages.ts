// Pakete eines Monats aus Zoho Inventory laden und als Rohdaten ablegen.
//   node bin/zoho-packages.ts 2026-09 private/fixtures/2026-09/inventory.json
// Braucht ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_INVENTORY_REFRESH_TOKEN
// (Scopes ZohoInventory.packages.READ,ZohoInventory.salesorders.READ) und
// Netzzugang zu accounts.zoho.eu und www.zohoapis.eu. Die Ausgabe enthält
// Kundendaten und gehört nach private/ (gitignored).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fetchInventoryPackages, refreshTokenAuth } from "../src/zoho.ts";
import { monthRange } from "../src/calendar.ts";

const [month, outArg] = process.argv.slice(2);
if (!/^\d{4}-\d{2}$/.test(month ?? "") || !outArg) {
  console.error("Aufruf: node bin/zoho-packages.ts JJJJ-MM <ausgabe.json>");
  process.exit(2);
}
const [year, m] = month.split("-").map(Number);
const range = monthRange({ year, month: m });
const { snapshot, packages, salesorders } = await fetchInventoryPackages(refreshTokenAuth(), range, { log: console.log });
const out = resolve(outArg);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ month, range, fetchedAt: snapshot.fetchedAt, packages, salesorders }, null, 1));
const partial = snapshot.orders.filter((o) => o.shippedStatus === "partially_shipped");
console.log(`${snapshot.orders.length} Aufträge, ${packages.length} Pakete -> ${out}`);
for (const o of partial)
  for (const p of o.packages)
    console.log(`  Teilversand ${o.orderNumber} ${p.packageNumber} ${p.shipDate}: ${p.lines.map((l) => `${l.quantity}× ${l.sku}`).join(", ")}`);
