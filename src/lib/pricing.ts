import config from '@/config/pricing.json';

export type MarketKey = 'de' | 'nl' | 'eu';
export type WeightKey = 'light' | 'medium' | 'heavy';
export type ValueServiceKey = 'branding' | 'bundling' | 'giftwrap';

export interface CalculatorInput {
  ordersPerMonth: number;
  picksPerOrder: number;
  pallets: number;
  markets: MarketKey[];
  weight: WeightKey;
  returnRate: number; // 0..1
  valueServices: ValueServiceKey[];
}

export interface CostBreakdown {
  storage: number;
  pickpack: number;
  shipping: number;
  returns: number;
  total: number;
}

export interface CalculatorResult {
  min: CostBreakdown;
  max: CostBreakdown;
  currency: string;
}

// Indikative Monatskosten aus der Konfig. Keine Tarife hart verdrahtet.
function baseBreakdown(input: CalculatorInput): CostBreakdown {
  const orders = Math.max(0, input.ordersPerMonth);
  const picks = Math.max(1, input.picksPerOrder);

  const storage = input.pallets * config.storage.perPalletPerMonth;

  const valueServicePerOrder = input.valueServices.reduce(
    (sum, key) => sum + (config.pickPack.valueServicePerOrder[key] ?? 0),
    0,
  );
  const pickpack =
    orders * (config.pickPack.baseOrder + picks * config.pickPack.perPick + valueServicePerOrder);

  // Bestellungen gleichmaessig auf gewaehlte Maerkte verteilt.
  const markets = input.markets.length ? input.markets : (['de'] as MarketKey[]);
  const ordersPerMarket = orders / markets.length;
  const weightSurcharge = config.shipping.weightSurcharge[input.weight] ?? 0;
  const shipping = markets.reduce((sum, market) => {
    const rate = config.shipping.perOrderByMarket[market] ?? 0;
    return sum + ordersPerMarket * (rate + weightSurcharge);
  }, 0);

  const returns = orders * clamp(input.returnRate, 0, 1) * config.returns.perReturn;

  const total = storage + pickpack + shipping + returns;
  return { storage, pickpack, shipping, returns, total };
}

function scale(b: CostBreakdown, factor: number): CostBreakdown {
  return {
    storage: b.storage * factor,
    pickpack: b.pickpack * factor,
    shipping: b.shipping * factor,
    returns: b.returns * factor,
    total: b.total * factor,
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const base = baseBreakdown(input);
  return {
    min: scale(base, config.rangeFactor.min),
    max: scale(base, config.rangeFactor.max),
    currency: config.currency,
  };
}

export function formatCurrency(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
