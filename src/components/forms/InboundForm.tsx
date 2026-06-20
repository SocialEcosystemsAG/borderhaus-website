'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = 'idle' | 'sending' | 'success' | 'error';

export function InboundForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const f = dict.form;
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Vorbefuellung aus dem Preisrechner.
  const [prefillMessage, setPrefillMessage] = useState('');
  useEffect(() => {
    if (params.get('from') === 'calculator') {
      const lines =
        locale === 'de'
          ? [
              'Anfrage aus dem Preisrechner:',
              `Bestellungen/Monat: ${params.get('orders') ?? ''}`,
              `Picks/Bestellung: ${params.get('picks') ?? ''}`,
              `Lagerbedarf (Paletten): ${params.get('pallets') ?? ''}`,
              `Zielmärkte: ${params.get('markets') ?? ''}`,
              `Gewichtsklasse: ${params.get('weight') ?? ''}`,
              `Retourenquote: ${params.get('returns') ?? ''}`,
              `Mehrwertservices: ${params.get('services') || '-'}`,
            ]
          : [
              'Request from the price calculator:',
              `Orders/month: ${params.get('orders') ?? ''}`,
              `Picks/order: ${params.get('picks') ?? ''}`,
              `Storage (pallets): ${params.get('pallets') ?? ''}`,
              `Target markets: ${params.get('markets') ?? ''}`,
              `Weight class: ${params.get('weight') ?? ''}`,
              `Return rate: ${params.get('returns') ?? ''}`,
              `Value-added services: ${params.get('services') || '-'}`,
            ];
      setPrefillMessage(lines.join('\n'));
    }
  }, [params, locale]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nextErrors: Record<string, string> = {};
    if (!String(data.get('brand') || '').trim()) nextErrors.brand = f.required;
    const email = String(data.get('email') || '').trim();
    if (!email) nextErrors.email = f.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = f.invalidEmail;
    if (!String(data.get('name') || '').trim()) nextErrors.name = f.required;
    if (!data.get('consent')) nextErrors.consent = f.consentRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');
    try {
      const payload = Object.fromEntries(data.entries());
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, locale }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="card-light border-accent/40 p-8" role="status">
        <h3 className="text-2xl font-semibold">{f.successHeading}</h3>
        <p className="mt-3 text-canvas/70">{f.successBody}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="card-light space-y-5 p-7" noValidate>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      )}

      {/* Honeypot: fuer Menschen unsichtbar. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Do not fill</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f.fields.brand} name="brand" placeholder={f.placeholders.brand} required error={errors.brand} />
        <Field label={f.fields.shopSystem} name="shopSystem" placeholder={f.placeholders.shopSystem} />
        <Field label={f.fields.volume} name="volume" placeholder={f.placeholders.volume} />
        <Field label={f.fields.markets} name="markets" placeholder="DE, NL" />
        <Field
          label={f.fields.currentLogistics}
          name="currentLogistics"
          placeholder={f.placeholders.currentLogistics}
        />
        <Field label={f.fields.desiredStart} name="desiredStart" type="month" />
      </div>

      <div>
        <label className="label-mono mb-2 block" htmlFor="message">
          {f.fields.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={prefillMessage}
          placeholder={f.placeholders.message}
          className="w-full rounded-lg border border-canvas/15 bg-cream px-4 py-2.5 text-canvas focus:border-accent"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label={f.fields.name} name="name" required error={errors.name} />
        <Field label={f.fields.email} name="email" type="email" required error={errors.email} />
        <Field label={f.fields.phone} name="phone" type="tel" />
      </div>

      <label className="flex items-start gap-3 text-sm text-canvas/70">
        <input type="checkbox" name="consent" value="yes" className="mt-1 accent-accent" />
        <span>
          {f.fields.consent}
          {errors.consent && <span className="mt-1 block text-accent">{errors.consent}</span>}
        </span>
      </label>

      {TURNSTILE_SITE_KEY && (
        <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? f.sending : f.submit}
        </button>
        {status === 'error' && (
          <p className="text-sm text-accent" role="alert">
            {f.errorHeading} {f.errorBody}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="label-mono mb-2 block" htmlFor={name}>
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        className="w-full rounded-lg border border-canvas/15 bg-cream px-4 py-2.5 text-canvas focus:border-accent"
      />
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
}
