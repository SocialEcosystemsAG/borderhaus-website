import config from '@/config/pricing.json';

export type WeightKey = 'light' | 'medium' | 'heavy';

// Eingabezustand Runde 2b: Hauptausgabe sind die Gesamtkosten pro Monat.
export interface CalculatorState {
  orders: number; // Bestellungen pro Monat
  picks: number; // Artikel pro Bestellung
  skus: number; // Anzahl SKUs = Fachbodenplätze, treibt Fach-Lagerung
  deliveries: number; // Anlieferungen pro Monat, treibt Inbound
  goodsValue: number; // Warenwert im Lager, treibt Versicherung
  de: boolean;
  nl: boolean;
  weight: WeightKey;
  returns: number; // Prozent
  kitting: boolean;
  assembly: boolean; // Bundles und Produkt-Assembly
}

export interface CalculatorResult {
  // Monatliche Kategorien (Hauptausgabe)
  storage: number;
  inbound: number;
  pickpack: number;
  shipping: number;
  returns: number;
  valueAdd: number;
  insurance: number;
  monthlyFlat: number;
  setupOnce: number;
  monthlyTotal: number;
  monthlyLow: number;
  monthlyHigh: number;
  // Pro Sendung (kleine Nebeninfo)
  perShipment: number;
}

export const DEFAULT_STATE: CalculatorState = {
  orders: 1000,
  picks: 1,
  skus: 180,
  deliveries: 2,
  goodsValue: 50000,
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

// Gesamtkosten pro Monat mit Aufschlüsselung. Tarife aus der Konfig.
export function compute(s: CalculatorState): CalculatorResult {
  const orders = Math.max(1, s.orders);
  const map = config.weightMap[s.weight];

  const pickPerOrder = config.outbound.orderInclFirstPick + Math.max(0, s.picks - 1) * config.outbound.perAdditionalPick;
  const carton = (config.packaging as Record<string, number>)[map.carton] ?? 0;
  const ship = shipRate(s, map.tier);
  const valueAddPerOrder =
    (s.kitting ? config.service.kittingMinutes * config.valueAdd.staffPerMinute : 0) +
    (s.assembly ? config.service.assemblyMinutes * config.valueAdd.staffPerMinute : 0);
  const returnPerOrder = (s.returns / 100) * config.returns.perReturn;

  // Monatliche Kategorien.
  const storage = s.skus * config.storageWeekly.binM * config.weeksPerMonth;
  const inbound = s.deliveries * config.inbound.perDelivery;
  const pickpack = orders * (pickPerOrder + carton);
  const shipping = orders * ship;
  const returns = orders * returnPerOrder;
  const valueAdd = orders * valueAddPerOrder;
  const insurance = (Math.max(0, s.goodsValue) / 1000) * config.valueAdd.insurancePer1000PerMonth;
  const monthlyFlat = config.monthlyFlat;

  const monthlyTotal = storage + inbound + pickpack + shipping + returns + valueAdd + insurance + monthlyFlat;
  const { low, high } = config.range;

  // Pro-Sendung-Nebeninfo: variable Kosten je Sendung (ohne Pauschale/Inbound).
  const perShipment = pickPerOrder + carton + ship + storage / orders + returnPerOrder + valueAddPerOrder;

  return {
    storage,
    inbound,
    pickpack,
    shipping,
    returns,
    valueAdd,
    insurance,
    monthlyFlat,
    setupOnce: config.setupOnce,
    monthlyTotal,
    monthlyLow: monthlyTotal * low,
    monthlyHigh: monthlyTotal * high,
    perShipment,
  };
}

// Pro-Sendung mit zwei Nachkommastellen.
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
