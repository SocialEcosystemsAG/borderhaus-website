'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { path } from '@/i18n/routes';
import { compute, fmt, DEFAULT_STATE, type CalculatorState, type WeightKey } from '@/lib/pricing';

// Preisrechner-Island exakt nach Borderhaus_Homepage_v2.html (dunkle Panels).
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
  const ordersFmt = s.orders.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US');

  function requestQuote() {
    const de = locale === 'de';
    const markets = [s.de ? 'DE' : null, s.nl ? 'NL' : null, s.eu ? 'EU' : null].filter(Boolean).join('/');
    const summary =
      (de ? 'Anfrage aus dem Preisrechner: ' : 'Request from the price calculator: ') +
      s.orders +
      (de ? ' Bestellungen/Monat, ' : ' orders/month, ') +
      s.picks +
      (de ? ' Artikel/Bestellung, ' : ' items/order, ') +
      (de ? 'Märkte ' : 'markets ') +
      markets +
      '. ' +
      (de ? 'Geschätzt ' : 'Estimated ') +
      fmt(r.low) +
      '–' +
      fmt(r.high) +
      (de ? '/Monat.' : '/month.');
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
        <Slider label={c.cOrders} value={<span style={valStyle}>{ordersFmt}</span>}>
          <input className="bh-range" type="range" min={100} max={50000} step={100} value={s.orders} onChange={(e) => set({ orders: parseInt(e.target.value, 10) })} />
        </Slider>
        <Slider label={c.cPicks} value={<span style={valStyle}>{s.picks}</span>}>
          <input className="bh-range" type="range" min={1} max={10} step={1} value={s.picks} onChange={(e) => set({ picks: parseInt(e.target.value, 10) })} />
        </Slider>
        <Slider label={c.cStorage} value={<span style={valStyle}>{s.storage}</span>}>
          <input className="bh-range" type="range" min={1} max={200} step={1} value={s.storage} onChange={(e) => set({ storage: parseInt(e.target.value, 10) })} />
        </Slider>

        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>{c.cMarkets}</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span onClick={() => set({ de: !s.de })} style={{ ...chipBase, fontFamily: "'Space Mono', monospace", ...chip(s.de) }}>DE</span>
            <span onClick={() => set({ nl: !s.nl })} style={{ ...chipBase, fontFamily: "'Space Mono', monospace", ...chip(s.nl) }}>NL</span>
            <span onClick={() => set({ eu: !s.eu })} style={{ ...chipBase, fontFamily: "'Space Mono', monospace", ...chip(s.eu) }}>EU</span>
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>{c.cWeight}</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(['s', 'm', 'l'] as WeightKey[]).map((w) => (
              <span key={w} onClick={() => set({ weight: w })} style={{ ...chipBase, ...chip(s.weight === w) }}>
                {w === 's' ? c.cwS : w === 'm' ? c.cwM : c.cwL}
              </span>
            ))}
          </div>
        </div>

        <Slider label={c.cReturns} value={<span style={valStyle}>{s.returns}&thinsp;%</span>}>
          <input className="bh-range" type="range" min={0} max={40} step={1} value={s.returns} onChange={(e) => set({ returns: parseInt(e.target.value, 10) })} />
        </Slider>

        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>{c.cServices}</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span onClick={() => set({ kitting: !s.kitting })} style={{ ...chipBase, ...chip(s.kitting) }}>{c.cKitting}</span>
            <span onClick={() => set({ bundles: !s.bundles })} style={{ ...chipBase, ...chip(s.bundles) }}>{c.cBundles}</span>
          </div>
        </div>
      </div>

      {/* Ergebnis dunkel, sticky */}
      <div style={{ position: 'sticky', top: 90, color: '#f5f3ee', background: 'linear-gradient(180deg,#16171c,#0e0e10)', border: '1px solid #2a2b30', borderRadius: 16, padding: 'clamp(24px,3vw,34px)' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: '#7d7d84' }}>{c.cResultLabel}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(30px,4vw,46px)', fontWeight: 700, lineHeight: 1.05, margin: '10px 0 4px' }}>
          {fmt(r.low)} <span style={{ color: '#7d7d84' }}>&ndash;</span> {fmt(r.high)}
        </div>
        <div style={{ fontSize: 14, color: '#7d7d84', marginBottom: 22 }}>{c.cPerMonth}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #26262a', paddingTop: 20 }}>
          <Row label={c.cBreakStorage} value={fmt(r.storage)} />
          <Row label={c.cBreakPick} value={fmt(r.pick)} />
          <Row label={c.cBreakShip} value={fmt(r.ship)} />
          <Row label={c.cBreakReturns} value={fmt(r.ret)} />
          {r.hasSvc && <Row label={c.cBreakServices} value={fmt(r.svc)} />}
        </div>
        <button type="button" onClick={requestQuote} className="bh-cta" style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 24, background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: 14, borderRadius: 10, border: 'none', cursor: 'pointer' }}>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
      <span style={{ color: '#bcbcbf' }}>{label}</span>
      <span style={{ fontFamily: "'Space Mono', monospace" }}>{value}</span>
    </div>
  );
}
