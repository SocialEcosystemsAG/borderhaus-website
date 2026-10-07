// Lauf aus lokalen Snapshots erzeugen (bis die App den Scheduler übernimmt).
//   node bin/run-month.ts private/runs/2026-09.spec.json
// Die Spec und alle Daten liegen in private/ (gitignored): Stammdaten,
// Zoho-Snapshot, Historie, Overrides. Ausgabe: <outDir>/v<N>/ (neue Version je Lauf).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { booksToSnapshot, inventoryToSnapshot, type BooksDetail, type BooksListRow } from "../src/zoho.ts";
import { DEFAULT_MAPPING, withExclusions } from "../src/sku-mapping.ts";
import { buildRun, renderReview, type RunConfig } from "../src/run.ts";
import type { HistoryEntry, Override } from "../src/types.ts";
import type { OpenItem } from "../src/checks.ts";

type Spec = {
  month: string; // YYYY-MM
  today: string;
  runNumber: number;
  config: string;
  /** Paketdaten aus bin/zoho-packages.ts (Zielweg). Gesetzt -> zohoList/zohoDetails werden ignoriert. */
  inventory?: string;
  zohoList?: string;
  zohoDetails?: string[];
  history: string[];
  overrides: string;
  exclusions: string;
  openItems: OpenItem[];
  openOrders?: { orderNumber: string; orderDate: string; shippedStatus: string; customerName: string }[];
  outDir: string;
};

const specPath = resolve(process.argv[2] ?? "");
const base = dirname(specPath);
const p = (f: string) => resolve(base, f);
const spec = JSON.parse(readFileSync(specPath, "utf8")) as Spec;
const [year, month] = spec.month.split("-").map(Number);

const config = JSON.parse(readFileSync(p(spec.config), "utf8")) as RunConfig;
function loadSnapshot() {
  if (spec.inventory) {
    const inv = JSON.parse(readFileSync(p(spec.inventory), "utf8"));
    return inventoryToSnapshot(inv.packages, inv.salesorders, inv.range, inv.fetchedAt);
  }
  const list = JSON.parse(readFileSync(p(spec.zohoList!), "utf8")) as BooksListRow[];
  const details = (spec.zohoDetails ?? []).flatMap((f) =>
    readFileSync(p(f), "utf8").trim().split("\n").map((l) => JSON.parse(l) as BooksDetail),
  );
  return booksToSnapshot(list, details, new Date().toISOString());
}
const snapshot = loadSnapshot();
snapshot.openOrders = spec.openOrders ?? [];
const excl = JSON.parse(readFileSync(p(spec.exclusions), "utf8"));
const mapping = withExclusions(DEFAULT_MAPPING, excl.exclusions, {
  version: excl.version,
  validFrom: excl.validFrom,
  changedBy: excl.changedBy,
  changeNote: excl.changeNote,
});
const history = spec.history.flatMap((f) => JSON.parse(readFileSync(p(f), "utf8")) as HistoryEntry[]);
const overrides = JSON.parse(readFileSync(p(spec.overrides), "utf8")) as Override[];

const run = await buildRun({
  ym: { year, month },
  today: spec.today,
  runNumber: spec.runNumber,
  config,
  snapshot,
  mapping,
  overrides,
  history,
  openItems: spec.openItems,
});

const outRoot = p(spec.outDir);
mkdirSync(outRoot, { recursive: true });
const version = (existsSync(outRoot) ? readdirSync(outRoot).filter((d) => /^v\d+$/.test(d)).length : 0) + 1;
const out = join(outRoot, `v${version}`);
mkdirSync(out);
const { sheetBytes, xml, ...json } = run;
writeFileSync(join(out, "run.json"), JSON.stringify({ version, createdAt: new Date().toISOString(), ...json }, null, 1));
writeFileSync(join(out, run.files.sheet), sheetBytes);
writeFileSync(join(out, run.files.xml), xml);
writeFileSync(join(out, "pruefansicht.md"), renderReview(run));
writeFileSync(join(out, "mail.txt"), `Von: ${run.mail.from}\nAn: ${run.mail.to.join(", ")}\nBCC: ${run.mail.bcc.join(", ")}\nBetreff: ${run.mail.subject}\n\n${run.mail.body}\n`);
console.log(`${run.monthName} v${version}: ${run.totalsText}, ${run.totals.orders} Aufträge / ${run.totals.positions} Positionen, ${run.blockers} Blocker, ${run.warnings} Warnungen -> ${out}`);
