'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { compute, fmt, fmt0, DEFAULT_STATE, type CalculatorState, type WeightKey } from '@/lib/pricing';

// Preisrechner Runde 2b: Gesamtkosten pro Monat als Hauptausgabe.
const chip = (active: boolean): React.CSSProperties =>
  active
    ? { background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, border: '1px solid #ff4a1c' }
    : { background: '#0b0b0c', color: '#bcbcbf', border: '1px solid #3a3a40' };

export function PriceCalculator({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.calculator;
  const [s, setS] = useState<CalculatorState>(DEFAULT_STATE);
  const r = useMemo(() => compute(s), [s]);
  const router = useRouter();
  const set = (patch: Partial<CalculatorState>) => setS((prev) => ({ ...prev, ...patch }));
  const f0 = (n: number) => fmt0(n, locale);

  function requestQuote() {
    const de = locale === 'de';
    const markets = [s.de ? 'DE' : null, s.nl ? 'NL' : null].filter(Boolean).join('/');
    const services = [s.kitting ? c.cKitting : null, s.assembly ? c.cAssembly : null].filter(Boolean).join(', ');
    const summary =
      (de ? 'Anfrage aus dem Preisrechner: ' : 'Request from the price calculator: ') +
      s.orders + (de ? ' Bestellungen/Monat, ' : ' orders/month, ') +
      s.picks + (de ? ' Artikel/Bestellung, ' : ' items/order, ') +
      s.skus + ' SKUs, ' + s.deliveries + (de ? ' Anlieferungen/Monat, ' : ' deliveries/month, ') +
      (de ? 'Märkte ' : 'markets ') + markets + ', ' +
      (de ? 'Gewicht ' : 'weight ') + (s.weight === 'light' ? c.cwS : s.weight === 'medium' ? c.cwM : c.cwL) +
      (services ? `, ${services}` : '') + '. ' +
      (de ? 'Geschätzte Gesamtkosten ' : 'Estimated total ') + `${f0(r.monthlyLow)} – ${f0(r.monthlyHigh)}` +
      (de ? ' pro Monat.' : ' per month.');
    const params = new URLSearchParams({ from: 'calculator', message: summary });
    router.push(`${path(locale, 'contact')}?${params.toString()}`);
  }

  const chipBase: React.CSSProperties = { cursor: 'pointer', fontSize: 14, padding: '9px 16px', borderRadius: 8 };
  const labelStyle: React.CSSProperties = { fontSize: 15, fontWeight: 600 };
  const valStyle: React.CSSProperties = { fontFamily: "'Space Mono', monospace", color: '#ff4a1c', fontWeight: 700 };

  return (
    <div className="bh-calc">
      {/* Eingaben dunkel */}
      <div style={{ background: '#141417', color: '#f5f3ee', border: '1px solid #26262a', borderRadius: 16, padding: 'clamp(24px,3vw,38px)', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Slider label={c.cOrders} value={<span style={valStyle}>{s.orders.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US')}</span>}>
          <input className="bh-range" type="range" min={100} max={50000} step={100} value={s.orders} onChange={(e) => set({ orders: +e.target.value })} />
        </Slider>
        <Slider label={c.cPicks} value={<span style={valStyle}>{s.picks}</span>}>
          <input className="bh-range" type="range" min={1} max={10} step={1} value={s.picks} onChange={(e) => set({ picks: +e.target.value })} />
        </Slider>
        <Slider label={c.cSkus} value={<span style={valStyle}>{s.skus}</span>}>
          <input className="bh-range" type="range" min={1} max={2000} step={1} value={s.skus} onChange={(e) => set({ skus: +e.target.value })} />
        </Slider>
        <Slider label={c.cDeliveries} value={<span style={valStyle}>{s.deliveries}</span>}>
          <input className="bh-range" type="range" min={1} max={60} step={1} value={s.deliveries} onChange={(e) => set({ deliveries: +e.target.value })} />
        </Slider>
        <Slider label={c.cGoodsValue} value={<span style={valStyle}>{fmt0(s.goodsValue, locale)}</span>}>
          <input className="bh-range" type="range" min={0} max={500000} step={1000} value={s.goodsValue} onChange={(e) => set({ goodsValue: +e.target.value })} />
        </Slider>

        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>{c.cMarkets}</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span onClick={() => set({ de: !s.de })} style={{ ...chipBase, fontFamily: "'Space Mono', monospace", ...chip(s.de) }}>DE</span>
            <span onClick={() => set({ nl: !s.nl })} style={{ ...chipBase, fontFamily: "'Space Mono', monospace", ...chip(s.nl) }}>NL</span>
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>{c.cWeight}</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(['light', 'medium', 'heavy'] as WeightKey[]).map((w) => (
              <span key={w} onClick={() => set({ weight: w })} style={{ ...chipBase, ...chip(s.weight === w) }}>
                {w === 'light' ? c.cwS : w === 'medium' ? c.cwM : c.cwL}
              </span>
            ))}
          </div>
        </div>

        <Slider label={c.cReturns} value={<span style={valStyle}>{s.returns}&thinsp;%</span>}>
          <input className="bh-range" type="range" min={0} max={40} step={1} value={s.returns} onChange={(e) => set({ returns: +e.target.value })} />
        </Slider>

        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>{c.cServices}</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span onClick={() => set({ kitting: !s.kitting })} style={{ ...chipBase, ...chip(s.kitting) }}>{c.cKitting}</span>
            <span onClick={() => set({ assembly: !s.assembly })} style={{ ...chipBase, ...chip(s.assembly) }}>{c.cAssembly}</span>
          </div>
        </div>
      </div>

      {/* Ergebnis dunkel, sticky. Gesamtkosten pro Monat prominent. */}
      <div style={{ position: 'sticky', top: 90, color: '#f5f3ee', background: 'linear-gradient(180deg,#16171c,#0e0e10)', border: '1px solid #2a2b30', borderRadius: 16, padding: 'clamp(24px,3vw,34px)' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: '#7d7d84' }}>{c.cResultLabel}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, lineHeight: 1.05, margin: '10px 0 2px' }}>
          {f0(r.monthlyLow)} <span style={{ color: '#7d7d84' }}>&ndash;</span> {f0(r.monthlyHigh)}
        </div>
        <div style={{ fontSize: 14, color: '#7d7d84' }}>{c.cPerMonth}</div>
        {/* Pro-Sendung nur klein als Nebeninfo */}
        <div style={{ fontSize: 13, color: '#9a9aa0', marginTop: 6 }}>
          &asymp; {fmt(r.perShipment, locale)} {c.cPerShipmentNote}
        </div>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7d7d84', margin: '20px 0 10px' }}>{c.cBreakdownLabel}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, borderTop: '1px solid #26262a', paddingTop: 16 }}>
          <Row label={c.cBreakStorage} value={f0(r.storage)} />
          <Row label={c.cBreakInbound} value={f0(r.inbound)} />
          <Row label={c.cBreakPick} value={f0(r.pickpack)} />
          <Row label={c.cBreakShip} value={f0(r.shipping)} />
          {r.returns > 0 && <Row label={c.cBreakReturns} value={f0(r.returns)} />}
          {r.valueAdd > 0 && <Row label={c.cBreakValue} value={f0(r.valueAdd)} />}
          <Row label={c.cBreakInsurance} value={f0(r.insurance)} />
          <Row label={c.cFlat} value={f0(r.monthlyFlat)} />
        </div>

        <div style={{ marginTop: 14, borderTop: '1px solid #26262a', paddingTop: 14 }}>
          <Row label={c.cSetup} value={f0(r.setupOnce)} muted />
        </div>

        <button type="button" onClick={requestQuote} className="bh-cta" style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 22, background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: 14, borderRadius: 10, border: 'none', cursor: 'pointer' }}>
          {c.cQuote}
        </button>
        <p style={{ fontSize: 12, lineHeight: 1.45, color: '#6b6b71', margin: '16px 0 0' }}>{dict.pages.pricing.disclaimer}</p>
      </div>
    </div>
  );
}

function Slider({ label, value, children }: { label: string; value: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <label style={{ fontSize: 15, fontWeight: 600 }}>{label}</label>
        {value}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, gap: 12 }}>
      <span style={{ color: muted ? '#7d7d84' : '#bcbcbf' }}>{label}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", color: muted ? '#7d7d84' : '#f5f3ee' }}>{value}</span>
    </div>
  );
}
