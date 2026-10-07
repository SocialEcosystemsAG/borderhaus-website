// SKU-Mapping (kg Röstkaffee je Einheit), Ausschlüsse und Kit-Zusammensetzung.
// Die Tabelle ist Daten, nicht Code: in der App editierbar und versioniert.
// Unbekannte SKU oder fehlendes Gewicht = Blocker.
import type { SkuResolution } from "./types.ts";

export type SkuRule =
  | { id: string; match: string; kind: "coffee"; kgPerUnit: number; note?: string }
  | { id: string; match: string; kind: "excluded"; reason: string }
  | { id: string; match: string; kind: "swiss"; note?: string };

export type KitRule = {
  id: string;
  /** Regex auf die (Basis-)SKU des Kits. */
  match: string;
  /** Feste Komponenten oder "same-base-x8" (CA-S-1xx_8 = 8 × CA-S-1xx). */
  components: { sku: string; quantity: number }[] | "same-base-x8" | "small-pair";
};

export type SkuMapping = {
  version: number;
  validFrom: string;
  changedBy: string;
  changeNote: string;
  rules: SkuRule[];
  kits: KitRule[];
  /** Kürzel der kleinen Probierpakete: CA SP_Small_<A>&<B>. */
  smallPairCodes: Record<string, string>;
};

/** Varianten wie CA-S-109_8_old1 oder CA-S-010_4_old zählen wie die Basis-SKU. */
export function baseSku(sku: string): string {
  return sku.trim().replace(/_old\d*$/i, "");
}

function rx(source: string): RegExp {
  return new RegExp(`^(?:${source})$`);
}

export function resolveSku(sku: string, mapping: SkuMapping): SkuResolution {
  const base = baseSku(sku);
  for (const rule of mapping.rules) {
    if (!rx(rule.match).test(base)) continue;
    if (rule.kind === "coffee") {
      if (!(rule.kgPerUnit > 0)) return { kind: "unknown" };
      return { kind: "coffee", kgPerUnit: rule.kgPerUnit, rule: rule.id, baseSku: base };
    }
    if (rule.kind === "swiss") return { kind: "swiss", rule: rule.id };
    return { kind: "excluded", reason: rule.reason, rule: rule.id };
  }
  return { kind: "unknown" };
}

/** Komponenten eines Kits laut Tabelle (Fallback, wenn Zoho keine mapped_items liefert). */
export function kitComponents(sku: string, mapping: SkuMapping): { sku: string; quantity: number }[] | null {
  const base = baseSku(sku);
  for (const kit of mapping.kits) {
    if (!rx(kit.match).test(base)) continue;
    if (kit.components === "same-base-x8") {
      return [{ sku: base.replace(/_8$/, ""), quantity: 8 }];
    }
    if (kit.components === "small-pair") {
      const m = base.match(/^CA SP_Small_([A-Z]{2})&([A-Z]{2})$/);
      if (!m) return null;
      const a = mapping.smallPairCodes[m[1]];
      const b = mapping.smallPairCodes[m[2]];
      if (!a || !b) return null;
      return [
        { sku: a, quantity: 1 },
        { sku: b, quantity: 1 },
      ];
    }
    return kit.components;
  }
  return null;
}

/**
 * Standardtabelle, Stand 07.10.2026 (Briefing Kap. 3.3). Reihenfolge zählt:
 * erste passende Regel gewinnt. CH_-Ware steht vorne, damit sie nie als
 * Röstkaffee DE gewertet wird.
 */
export const DEFAULT_MAPPING: SkuMapping = {
  version: 1,
  validFrom: "2026-09-01",
  changedBy: "Briefing 07.10.2026",
  changeNote: "Initiale Tabelle aus Briefing 07.10.2026",
  rules: [
    { id: "swiss", match: "CH_.*", kind: "swiss", note: "Schweizer Ware nie in der DE-Anmeldung" },
    { id: "palette", match: ".+_P", kind: "coffee", kgPerUnit: 248, note: "Palette 248 × 1 kg" },
    { id: "ca-1kg-x4", match: "CA-R-00\\d_4|CA-S-010_4", kind: "coffee", kgPerUnit: 4 },
    { id: "ca-1kg", match: "CA-R-00\\d|CA-S-010", kind: "coffee", kgPerUnit: 1 },
    { id: "ca-specialty-x8", match: "CA-S-1\\d\\d_8", kind: "coffee", kgPerUnit: 2.8, note: "8 × 350 g" },
    { id: "ca-specialty", match: "CA-S-1\\d\\d", kind: "coffee", kgPerUnit: 0.35, note: "350 g" },
    { id: "sp-large", match: "CA SP-Large", kind: "coffee", kgPerUnit: 1.4 },
    { id: "sp-medium", match: "CA SP-Medium", kind: "coffee", kgPerUnit: 1.05 },
    { id: "sp-small", match: "CA SP_Small_.+|CA SP-Small.*", kind: "coffee", kgPerUnit: 0.7 },
    { id: "slow-k6", match: "\\d{5}[A-Z]?-K6(?:_[A-Z]+)?", kind: "coffee", kgPerUnit: 6, note: "Slow 6 × 1 kg" },
    { id: "slow-k4", match: "\\d{5}[A-Z]?-K4(?:_[A-Z]+)?", kind: "coffee", kgPerUnit: 4, note: "Slow 4 × 1 kg" },
    { id: "slow-k10", match: "\\d{5}[A-Z]?-K10(?:_[A-Z]+)?", kind: "coffee", kgPerUnit: 5, note: "Slow 10 × 500 g" },
    { id: "10min-1kg", match: "Ken_Filter-1|Bra_Espresso-1", kind: "coffee", kgPerUnit: 1, note: "10 Minutes 1 kg" },
  ],
  kits: [
    {
      id: "sp-large",
      match: "CA SP-Large",
      components: [
        { sku: "CA-S-109", quantity: 1 },
        { sku: "CA-S-115", quantity: 1 },
        { sku: "CA-S-120", quantity: 1 },
        { sku: "CA-S-130", quantity: 1 },
      ],
    },
    { id: "sp-small-pair", match: "CA SP_Small_[A-Z]{2}&[A-Z]{2}", components: "small-pair" },
    { id: "specialty-x8", match: "CA-S-1\\d\\d_8", components: "same-base-x8" },
  ],
  smallPairCodes: { HB: "CA-S-109", KF: "CA-S-115", UE: "CA-S-120", UF: "CA-S-130" },
};

/** Ausschlussregeln (kein Röstkaffee) an eine Tabelle anhängen, ohne Kaffee-Regeln zu überschreiben. */
export function withExclusions(
  mapping: SkuMapping,
  exclusions: { sku: string; reason: string }[],
  meta: { version: number; changedBy: string; changeNote: string; validFrom: string },
): SkuMapping {
  const escaped = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    ...mapping,
    ...meta,
    rules: [
      ...mapping.rules,
      ...exclusions.map((e) => ({
        id: `excl:${e.sku}`,
        match: escaped(e.sku),
        kind: "excluded" as const,
        reason: e.reason,
      })),
    ],
  };
}
