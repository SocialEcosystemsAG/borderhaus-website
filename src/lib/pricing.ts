import config from '@/config/pricing.json';

export type WeightKey = 'light' | 'medium' | 'heavy';

// Eingabezustand Runde 2: Pro-Sendung-Sicht mit echten Tarifen.
export interface CalculatorState {
  orders: number; // Bestellungen pro Monat
  picks: number; // Artikel pro Bestellung
  skus: number; // Anzahl SKUs = Fachbodenplätze, treibt Fach-Lagerung
  deliveries: number; // Anlieferungen pro Monat, treibt Inbound
  de: boolean;
  nl: boolean;
  weight: WeightKey;
  returns: number; // Prozent
  kitting: boolean;
  assembly: boolean; // Bundles und Produkt-Assembly
}

export interface CalculatorResult {
  // Pro-Sendung-Komponenten
  pick: number;
  packaging: number;
  shipping: number;
  storage: number;
  returns: number;
  valueAdd: number;
  perShipment: number;
  perShipmentLow: number;
  perShipmentHigh: number;
  // Monatlich
  monthly: number;
  monthlyLow: number;
  monthlyHigh: number;
  inboundMonthly: number;
  monthlyFlat: number;
  setupOnce: number;
}

export const DEFAULT_STATE: CalculatorState = {
  orders: 1000,
  picks: 1,
  skus: 180,
  deliveries: 2,
  de: true,
  nl: false,
  weight: 'light',
  returns: 3,
  kitting: false,
  assembly: false,
};

type ShipTable = Record<string, number>;

function shipRate(state: CalculatorState, tier: string): number {
  const markets: ShipTable[] = [];
  if (state.de) markets.push(config.shipping.de as ShipTable);
  if (state.nl) markets.push(config.shipping.nl as ShipTable);
  if (markets.length === 0) markets.push(config.shipping.de as ShipTable);
  const sum = markets.reduce((acc, m) => acc + (m[tier] ?? 0), 0);
  return sum / markets.length;
}

// Berechnung der Pro-Sendung-Kosten plus Monatssicht. Tarife aus der Konfig.
export function compute(s: CalculatorState): CalculatorResult {
  const orders = Math.max(1, s.orders);
  const map = config.weightMap[s.weight];

  const pick = config.outbound.orderInclFirstPick + Math.max(0, s.picks - 1) * config.outbound.perAdditionalPick;
  const packaging = (config.packaging as Record<string, number>)[map.carton] ?? 0;
  const shipping = shipRate(s, map.tier);

  // Fach-Lagerung pro Monat über alle SKUs, anteilig je Sendung.
  const storageMonthly = s.skus * config.storageWeekly.binM * config.weeksPerMonth;
  const storage = storageMonthly / orders;

  const returns = (s.returns / 100) * config.returns.perReturn;

  const valueAdd =
    (s.kitting ? config.service.kittingMinutes * config.valueAdd.staffPerMinute : 0) +
    (s.assembly ? config.service.assemblyMinutes * config.valueAdd.staffPerMinute : 0);

  const perShipment = pick + packaging + shipping + storage + returns + valueAdd;

  const inboundMonthly = s.deliveries * config.inbound.perDelivery;
  const monthly = perShipment * orders + inboundMonthly + config.monthlyFlat;

  const { low, high } = config.range;
  return {
    pick,
    packaging,
    shipping,
    storage,
    returns,
    valueAdd,
    perShipment,
    perShipmentLow: perShipment * low,
    perShipmentHigh: perShipment * high,
    monthly,
    monthlyLow: monthly * low,
    monthlyHigh: monthly * high,
    inboundMonthly,
    monthlyFlat: config.monthlyFlat,
    setupOnce: config.setupOnce,
  };
}

// Pro-Sendung-Format mit zwei Nachkommastellen, locale-gerecht.
export function fmt(n: number, locale = 'de'): string {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// Monatsbeträge ohne Nachkommastellen.
export function fmt0(n: number, locale = 'de'): string {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(n);
}
