// Gemeinsame Typen des Kaffeesteuer-Moduls.
// Mengen werden intern in Gramm (ganzzahlig) geführt, Beträge in Cent, damit
// Summen über Tab 1, Tab 2 und Formular 1808 exakt übereinstimmen.

export type YearMonth = { year: number; month: number }; // month 1..12

export type CheckStatus = "ok" | "warning" | "blocker";

/** Eine Zeile so, wie sie aus Zoho kommt (Paket- oder Auftragsposition). */
export type SourceLine = {
  sku: string;
  name: string;
  quantity: number;
  /** Kit/Kombi-Artikel: Zusammensetzung laut Zoho (mapped_items). */
  isCombo?: boolean;
  components?: { sku: string; quantity: number }[];
};

/**
 * Ein Paket (Versandvorgang). Zählt im Monat seines Versanddatums.
 * Liefert die Quelle keine Pakete (Books-Connector), wird je Auftrag ein
 * Paket gebildet und das Versanddatum aus delivery_date bzw. dem
 * Abschlussdatum abgeleitet (shipDateSource).
 */
export type SourcePackage = {
  packageNumber: string;
  shipDate: string; // YYYY-MM-DD
  shipDateSource: "package" | "delivery_date" | "closed_date";
  lines: SourceLine[];
};

export type SourceOrder = {
  orderId: string;
  orderNumber: string;
  referenceNumber: string;
  orderDate: string; // YYYY-MM-DD
  customerName: string;
  shippedStatus: string; // fulfilled | partially_shipped | ...
  country: { name: string; code: string };
  /** Für die Paletten-Prüfung (Umswitch-Muster): Empfänger-Kennung. */
  recipientKey: string;
  packages: SourcePackage[];
};

export type SourceSnapshot = {
  source: "zoho-inventory-packages" | "zoho-books-salesorders";
  /** true, wenn Kit-Inhalte zusätzlich als Einzelzeilen geführt werden (Inventory-Paketreport). */
  componentsListedSeparately: boolean;
  fetchedAt: string;
  orders: SourceOrder[];
  /** Offene/teilversandte Aufträge mit Lieferadresse DE (Vorschau Folgemonat). */
  openOrders?: { orderNumber: string; orderDate: string; shippedStatus: string; customerName: string }[];
  /** Sales Returns im Monat (Hinweis auf Ausnahmefeld). */
  salesReturns?: { returnNumber: string; orderNumber: string; date: string }[];
};

export type SkuResolution =
  | { kind: "coffee"; kgPerUnit: number; rule: string; baseSku: string }
  | { kind: "excluded"; reason: string; rule: string }
  | { kind: "swiss"; rule: string }
  | { kind: "unknown" };

/** Gemeldete bzw. zu meldende Position (Tab 2, Historie). */
export type Position = {
  orderNumber: string;
  referenceNumber: string;
  packageNumber: string;
  shipDate: string;
  country: string;
  sku: string;
  name: string;
  kgPerUnit: number;
  quantity: number;
  grams: number;
  /** regular = Versand im Monat; nachmeldung/korrektur = manuell, eigene Zeile in Tab 1. */
  kind: "regular" | "nachmeldung" | "korrektur";
  label?: string;
};

/** Override/Ausnahme. Wird nur mit Pflicht-Begründung angewendet und protokolliert. */
export type Override =
  | {
      id: string;
      action: "exclude";
      orderNumber: string;
      sku?: string;
      packageNumber?: string;
      reason: string;
      user: string;
      at: string;
      source: "manual" | "ki-vorschlag";
    }
  | {
      id: string;
      action: "set_quantity";
      orderNumber: string;
      sku: string;
      quantity: number;
      reason: string;
      user: string;
      at: string;
      source: "manual" | "ki-vorschlag";
    }
  | {
      id: string;
      action: "set_country";
      orderNumber: string;
      country: string;
      reason: string;
      user: string;
      at: string;
      source: "manual" | "ki-vorschlag";
    }
  | {
      id: string;
      action: "add_position";
      position: Omit<Position, "grams">;
      reason: string;
      user: string;
      at: string;
      source: "manual" | "ki-vorschlag";
    };

export type HistoryEntry = {
  month: string; // YYYY-MM
  orderNumber: string;
  referenceNumber?: string;
  packageNumber?: string;
  sku: string;
  quantity: number;
  grams: number;
  shipDate?: string;
  recipientKey?: string;
  kind?: Position["kind"];
};

export type CheckResult = {
  id: number;
  key: string;
  title: string;
  status: CheckStatus;
  explanation: string;
  details: string[];
  /** Warnungen müssen einzeln bestätigt werden. */
  requiresConfirmation: boolean;
};

export type RunTotals = {
  grams: number;
  taxCents: number;
  orders: number;
  positions: number;
};
