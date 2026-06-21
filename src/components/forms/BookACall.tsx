'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

const labelStyle: React.CSSProperties = { fontSize: 13, color: '#bcbcbf', display: 'block', marginBottom: 6 };

// Book a Call: kurze Vorqualifizierung, dann eingebetteter Google-Kalender.
// Vorqualifizierungs-Daten gehen als Lead (Quelle book-a-call) an die API.
export function BookACall({ dict, bookingUrl }: { locale: Locale; dict: Dictionary; bookingUrl: string }) {
  const b = dict.bookPage;
  const f = dict.form;
  const [revealed, setRevealed] = useState(false);
  const [form, setForm] = useState({ brand: '', shop: 'shopify', volume: '', markets: '' });
  const set = (patch: Partial<typeof form>) => setForm((p) => ({ ...p, ...patch }));

  async function proceed(withData: boolean) {
    if (withData) {
      // Lead an die API; Fehler blockieren den Kalender nicht.
      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand: form.brand || '(book-a-call)',
            name: form.brand || '(book-a-call)',
            shopSystem: form.shop,
            volume: form.volume,
            markets: form.markets,
            email: '',
            message: 'Book-a-Call Vorqualifizierung',
            consent: 'yes',
            source: 'book-a-call',
          }),
        });
      } catch {
        /* still proceed */
      }
    }
    setRevealed(true);
  }

  return (
    <div className="bh-contact" style={{ maxWidth: 1080, margin: '0 auto' }}>
      <div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: '#ff4a1c', marginBottom: 18 }}>{b.label}</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,4.4vw,56px)', fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 18px', lineHeight: 1 }}>{b.title}</h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#3a3a40', margin: '0 0 24px' }}>{b.lead}</p>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[b.step1, b.step2].map((step, i) => (
            <li key={step} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#ff4a1c', flex: 'none', width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 16, color: '#3a3a40' }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div style={{ background: '#141417', color: '#f5f3ee', border: '1px solid #26262a', borderRadius: 16, padding: 'clamp(24px,3vw,38px)' }}>
        {!revealed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="bh-form2">
              <div>
                <label style={labelStyle} htmlFor="b-brand">{f.brand}</label>
                <input id="b-brand" className="bh-in" value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder={f.brandP} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="b-shop">{f.shop}</label>
                <select id="b-shop" className="bh-in" value={form.shop} onChange={(e) => set({ shop: e.target.value })}>
                  <option value="shopify">Shopify</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="shopware">Shopware</option>
                  <option value="billbee">Billbee</option>
                  <option value="weclapp">weclapp</option>
                  <option value="rest-api">REST-API</option>
                  <option value="other">{f.other}</option>
                </select>
              </div>
            </div>
            <div className="bh-form2">
              <div>
                <label style={labelStyle} htmlFor="b-volume">{f.volume}</label>
                <input id="b-volume" className="bh-in" value={form.volume} onChange={(e) => set({ volume: e.target.value })} placeholder={f.volumeP} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="b-markets">{f.markets}</label>
                <input id="b-markets" className="bh-in" value={form.markets} onChange={(e) => set({ markets: e.target.value })} placeholder={f.marketsP} />
              </div>
            </div>
            <button type="button" onClick={() => proceed(true)} className="bh-cta" style={{ textAlign: 'center', background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: 15, borderRadius: 10, border: 'none', cursor: 'pointer' }}>
              {b.submit}
            </button>
            <button type="button" onClick={() => proceed(false)} style={{ background: 'none', border: 'none', color: '#7d7d84', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
              {b.skip}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 15, color: '#dcdbd9', margin: '0 0 16px' }}>{b.submitted}</p>
            <iframe
              src={bookingUrl}
              title="Borderhaus Booking"
              style={{ width: '100%', height: 600, border: '1px solid #26262a', borderRadius: 12, background: '#fff' }}
            />
            <a href={bookingUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#ff4a1c' }}>
              {b.calendarFallback}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
