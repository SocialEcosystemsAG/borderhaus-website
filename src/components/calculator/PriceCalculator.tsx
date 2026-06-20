'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import {
  calculate,
  formatCurrency,
  type CalculatorInput,
  type MarketKey,
  type WeightKey,
  type ValueServiceKey,
} from '@/lib/pricing';

const MARKETS: MarketKey[] = ['de', 'nl', 'eu'];
const WEIGHTS: WeightKey[] = ['light', 'medium', 'heavy'];
const SERVICES: ValueServiceKey[] = ['branding', 'bundling', 'giftwrap'];

export function PriceCalculator({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.calculator;
  const [input, setInput] = useState<CalculatorInput>({
    ordersPerMonth: 1000,
    picksPerOrder: 2,
    pallets: 5,
    markets: ['de', 'nl'],
    weight: 'light',
    returnRate: 0.05,
    valueServices: [],
  });

  const result = useMemo(() => calculate(input), [input]);
  const router = useRouter();

  function toggleMarket(m: MarketKey) {
    setInput((prev) => ({
      ...prev,
      markets: prev.markets.includes(m)
        ? prev.markets.filter((x) => x !== m)
        : [...prev.markets, m],
    }));
  }

  function toggleService(s: ValueServiceKey) {
    setInput((prev) => ({
      ...prev,
      valueServices: prev.valueServices.includes(s)
        ? prev.valueServices.filter((x) => x !== s)
        : [...prev.valueServices, s],
    }));
  }

  function requestQuote() {
    // Eingaben an das Inbound-Formular durchreichen (Query-Params).
    const params = new URLSearchParams({
      from: 'calculator',
      orders: String(input.ordersPerMonth),
      picks: String(input.picksPerOrder),
      pallets: String(input.pallets),
      markets: input.markets.join(','),
      weight: input.weight,
      returns: String(input.returnRate),
      services: input.valueServices.join(','),
    });
    router.push(`${path(locale, 'contact')}?${params.toString()}`);
  }

  const fmt = (v: number) => formatCurrency(v, result.currency, locale);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,400px)]">
      {/* Eingaben auf hellem Grund. */}
      <div className="card-light space-y-6 p-7">
        <NumberField
          label={c.inputs.orders}
          value={input.ordersPerMonth}
          min={0}
          step={50}
          onChange={(v) => setInput((p) => ({ ...p, ordersPerMonth: v }))}
        />
        <NumberField
          label={c.inputs.picks}
          value={input.picksPerOrder}
          min={1}
          step={1}
          onChange={(v) => setInput((p) => ({ ...p, picksPerOrder: v }))}
        />
        <NumberField
          label={c.inputs.storage}
          value={input.pallets}
          min={0}
          step={1}
          onChange={(v) => setInput((p) => ({ ...p, pallets: v }))}
        />

        <fieldset>
          <legend className="label-mono mb-2">{c.inputs.markets}</legend>
          <div className="flex flex-wrap gap-2">
            {MARKETS.map((m) => (
              <Chip key={m} active={input.markets.includes(m)} onClick={() => toggleMarket(m)}>
                {c.markets[m]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label-mono mb-2">{c.inputs.weight}</legend>
          <div className="flex flex-wrap gap-2">
            {WEIGHTS.map((w) => (
              <Chip
                key={w}
                active={input.weight === w}
                onClick={() => setInput((p) => ({ ...p, weight: w }))}
              >
                {c.weights[w]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label-mono mb-2 block" htmlFor="returns">
            {c.inputs.returns}: {Math.round(input.returnRate * 100)}%
          </label>
          <input
            id="returns"
            type="range"
            min={0}
            max={50}
            step={1}
            value={Math.round(input.returnRate * 100)}
            onChange={(e) => setInput((p) => ({ ...p, returnRate: Number(e.target.value) / 100 }))}
            className="w-full accent-accent"
          />
        </div>

        <fieldset>
          <legend className="label-mono mb-2">{c.inputs.services}</legend>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <Chip key={s} active={input.valueServices.includes(s)} onClick={() => toggleService(s)}>
                {c.valueServices[s]}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Ausgabe als dunkle Feature-Karte (Kontrast-Anker). */}
      <div className="card-dark h-fit space-y-5 bg-panel p-7 lg:sticky lg:top-24">
        <div>
          <p className="label-mono text-accent-2">{c.estimateNote}</p>
          <h3 className="mt-1 text-lg font-semibold text-cream">{c.heading}</h3>
        </div>

        <p className="font-display text-3xl font-bold text-cream">
          {fmt(result.min.total)} <span className="text-muted">–</span> {fmt(result.max.total)}
          <span className="block text-sm font-normal text-grey-300">{c.perMonth}</span>
        </p>

        <dl className="space-y-2 border-t border-border pt-4 text-sm">
          <Row label={c.breakdown.storage} value={`${fmt(result.min.storage)} – ${fmt(result.max.storage)}`} />
          <Row label={c.breakdown.pickpack} value={`${fmt(result.min.pickpack)} – ${fmt(result.max.pickpack)}`} />
          <Row label={c.breakdown.shipping} value={`${fmt(result.min.shipping)} – ${fmt(result.max.shipping)}`} />
          <Row label={c.breakdown.returns} value={`${fmt(result.min.returns)} – ${fmt(result.max.returns)}`} />
        </dl>

        <button type="button" className="btn-primary w-full" onClick={requestQuote}>
          {dict.cta.requestQuote}
        </button>
        <p className="text-xs text-muted">{c.handoff}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="label-mono mb-2 block">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="w-full rounded-lg border border-canvas/15 bg-cream px-4 py-2.5 text-canvas focus:border-accent"
      />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? 'border-accent bg-accent text-cream'
          : 'border-canvas/20 bg-white text-canvas hover:border-accent'
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-grey-300">{label}</dt>
      <dd className="text-cream">{value}</dd>
    </div>
  );
}
