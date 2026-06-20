import config from '@/config/pricing.json';

export type WeightKey = 's' | 'm' | 'l';

// Eingabezustand exakt wie in der Design-Vorlage (Borderhaus_Homepage_v2.html).
export interface CalculatorState {
  orders: number;
  picks: number;
  storage: number; // Stellplätze
  de: boolean;
  nl: boolean;
  eu: boolean;
  weight: WeightKey;
  returns: number; // Prozent 0..40
  kitting: boolean;
  bundles: boolean;
}

export interface CalculatorResult {
  storage: number;
  pick: number;
  ship: number;
  ret: number;
  svc: number;
  low: number;
  high: number;
  hasSvc: boolean;
}

export const DEFAULT_STATE: CalculatorState = {
  orders: 5000,
  picks: 2,
  storage: 20,
  de: true,
  nl: true,
  eu: false,
  weight: 'm',
  returns: 8,
  kitting: false,
  bundles: false,
};

// Berechnung 1:1 zur Vorlage, Tarife aus der Konfig (nicht hart verdrahtet).
export function compute(c: CalculatorState): CalculatorResult {
  const storage = c.storage * config.storagePerUnitPerDay * config.daysPerMonth;
  const pick = c.orders * (config.pickFirst + Math.max(0, c.picks - 1) * config.pickAdd);
  const mult = c.eu ? config.marketMult.eu : c.nl ? config.marketMult.nl : config.marketMult.de;
  const ship = c.orders * config.ship[c.weight] * mult;
  const ret = c.orders * (c.returns / 100) * config.returnHandling;
  let svc = 0;
  if (c.kitting) svc += c.orders * config.services.kitting;
  if (c.bundles) svc += c.orders * config.services.bundles;
  const sub = storage + pick + ship + ret + svc;
  return {
    storage,
    pick,
    ship,
    ret,
    svc,
    low: sub * config.range.low,
    high: sub * config.range.high,
    hasSvc: c.kitting || c.bundles,
  };
}

// Formatierung exakt wie Vorlage: gerundet auf 10er, ohne Tausenderpunkt.
export function fmt(n: number): string {
  return '€' + Math.round(n / 10) * 10;
}
