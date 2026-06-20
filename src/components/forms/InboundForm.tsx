'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { Blitz } from '@/components/brand/Marks';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = 'idle' | 'sending' | 'success' | 'error';

const labelStyle: React.CSSProperties = { fontSize: 13, color: '#bcbcbf', display: 'block', marginBottom: 6 };
const errStyle: React.CSSProperties = { color: '#ff6b45', fontSize: 12, marginTop: 5 };

// Inbound-Formular exakt nach Design-Vorlage (dunkle Karte), plus Brief-Pflichten:
// Honeypot, optionales Cloudflare Turnstile, Validierung, API-Versand.
export function InboundForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const f = dict.form;
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<{ brand?: boolean; email?: boolean; consent?: boolean }>({});

  const [form, setForm] = useState({
    brand: '',
    shop: 'shopify',
    volume: '',
    markets: '',
    current: '',
    start: '',
    email: '',
    message: '',
    consent: false,
    company_website: '', // Honeypot
  });

  const set = (patch: Partial<typeof form>) => setForm((p) => ({ ...p, ...patch }));

  useEffect(() => {
    if (params.get('from') === 'calculator') {
      const msg = params.get('message');
      if (msg) setForm((p) => ({ ...p, message: msg }));
    }
  }, [params]);

  async function submit() {
    const nextErrors: typeof errors = {};
    if (!form.brand.trim()) nextErrors.brand = true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) nextErrors.email = true;
    if (!form.consent) nextErrors.consent = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('sending');
    try {
      const token =
        typeof document !== 'undefined'
          ? (document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value
          : undefined;
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand,
          shopSystem: form.shop,
          volume: form.volume,
          markets: form.markets,
          currentLogistics: form.current,
          desiredStart: form.start,
          email: form.email,
          message: form.message,
          name: form.brand,
          consent: form.consent ? 'yes' : '',
          company_website: form.company_website,
          'cf-turnstile-response': token,
          locale,
        }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const cardStyle: React.CSSProperties = {
    background: '#141417',
    color: '#f5f3ee',
    border: '1px solid #26262a',
    borderRadius: 16,
    padding: 'clamp(24px,3vw,38px)',
  };

  if (status === 'success') {
    return (
      <div style={cardStyle} role="status">
        <div style={{ textAlign: 'center', padding: '40px 10px' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 20px' }}>
            <Blitz size={64} glow={false} />
          </div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: '0 0 10px' }}>{f.sentT}</h3>
          <p style={{ fontSize: 16, color: '#dcdbd9', margin: 0 }}>{f.sentB}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Honeypot, für Menschen unsichtbar. */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <label htmlFor="company_website">Do not fill</label>
          <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={(e) => set({ company_website: e.target.value })} />
        </div>

        <div className="bh-form2">
          <div>
            <label style={labelStyle} htmlFor="brand">{f.brand}</label>
            <input id="brand" className="bh-in" value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder={f.brandP} />
            {errors.brand && <div style={errStyle}>{f.req}</div>}
          </div>
          <div>
            <label style={labelStyle} htmlFor="shop">{f.shop}</label>
            <select id="shop" className="bh-in" value={form.shop} onChange={(e) => set({ shop: e.target.value })}>
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
              <option value="other">{f.other}</option>
            </select>
          </div>
        </div>

        <div className="bh-form2">
          <div>
            <label style={labelStyle} htmlFor="volume">{f.volume}</label>
            <input id="volume" className="bh-in" value={form.volume} onChange={(e) => set({ volume: e.target.value })} placeholder={f.volumeP} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="markets">{f.markets}</label>
            <input id="markets" className="bh-in" value={form.markets} onChange={(e) => set({ markets: e.target.value })} placeholder={f.marketsP} />
          </div>
        </div>

        <div className="bh-form2">
          <div>
            <label style={labelStyle} htmlFor="current">{f.current}</label>
            <input id="current" className="bh-in" value={form.current} onChange={(e) => set({ current: e.target.value })} placeholder={f.currentP} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="start">{f.start}</label>
            <input id="start" className="bh-in" value={form.start} onChange={(e) => set({ start: e.target.value })} placeholder={f.startP} />
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="email">{f.email}</label>
          <input id="email" className="bh-in" type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder={f.emailP} />
          {errors.email && <div style={errStyle}>{f.emailErr}</div>}
        </div>

        <div>
          <label style={labelStyle} htmlFor="message">{f.message}</label>
          <textarea id="message" className="bh-in" rows={3} value={form.message} onChange={(e) => set({ message: e.target.value })} placeholder={f.messageP} />
        </div>

        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#bcbcbf', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.consent} onChange={(e) => set({ consent: e.target.checked })} style={{ marginTop: 3, accentColor: '#ff4a1c' }} />
          <span>{f.consent}</span>
        </label>
        {errors.consent && <div style={errStyle}>{f.consentErr}</div>}

        {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />}

        <button
          type="button"
          onClick={submit}
          disabled={status === 'sending'}
          className="bh-cta"
          style={{ textAlign: 'center', background: '#ff4a1c', color: '#0b0b0c', fontWeight: 700, fontSize: 16, padding: 15, borderRadius: 10, border: 'none', cursor: 'pointer' }}
        >
          {status === 'sending' ? f.sending : f.submit}
        </button>
        {status === 'error' && (
          <p style={errStyle} role="alert">
            {f.errorHeading} {f.errorBody}
          </p>
        )}
      </div>
    </div>
  );
}
