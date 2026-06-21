import { NextRequest, NextResponse } from 'next/server';
import { createZohoLead } from '@/lib/zoho';

export const runtime = 'nodejs';

interface LeadPayload {
  [key: string]: string | undefined;
  brand?: string;
  email?: string;
  name?: string;
  message?: string;
  shopSystem?: string;
  volume?: string;
  markets?: string;
  source?: string;
  company_website?: string; // Honeypot
  'cf-turnstile-response'?: string;
  consent?: string;
  locale?: string;
}

async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Nicht konfiguriert: Schritt ueberspringen.
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendMail(lead: LeadPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_INBOX || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.LEAD_FROM || 'Borderhaus <leads@borderhaus.com>';
  if (!apiKey || !to) {
    // Kein Mailprovider konfiguriert: Lead protokollieren, damit nichts verloren geht.
    console.warn('[lead] kein RESEND_API_KEY/LEAD_INBOX gesetzt. Lead:', lead);
    return true;
  }
  const lines = Object.entries(lead)
    .filter(([key]) => !['company_website', 'cf-turnstile-response'].includes(key))
    .map(([key, value]) => `${key}: ${value ?? ''}`)
    .join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `Neue Borderhaus Anfrage: ${lead.brand ?? 'Brand'}`,
      text: lines,
    }),
  });
  return res.ok;
}

async function forwardToCrm(lead: LeadPayload): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
  } catch (err) {
    console.error('[lead] CRM-Webhook fehlgeschlagen', err);
  }
}

export async function POST(request: NextRequest) {
  let lead: LeadPayload;
  try {
    lead = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: ausgefuellt = Bot. Still mit OK antworten.
  if (lead.company_website) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const human = await verifyTurnstile(lead['cf-turnstile-response'], ip);
  if (!human) {
    return NextResponse.json({ ok: false, error: 'verification_failed' }, { status: 400 });
  }

  // Pflichtfelder serverseitig pruefen. E-Mail ist optional (Book-a-Call-
  // Vorqualifizierung hat keine), aber falls vorhanden, muss sie gueltig sein.
  const email = (lead.email ?? '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }
  if (!lead.brand?.trim() && !lead.name?.trim()) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }
  if (lead.consent !== 'yes') {
    return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 422 });
  }

  // Lead an Zoho CRM (env-gated) und Mail-Fallback, plus optionaler Webhook.
  const zohoOk = await createZohoLead({
    name: lead.name,
    email: lead.email,
    brand: lead.brand,
    shopSystem: lead.shopSystem,
    volume: lead.volume,
    markets: lead.markets,
    message: lead.message,
    source: lead.source,
  });
  const mailed = await sendMail(lead);
  await forwardToCrm(lead);

  // Erfolg, wenn mindestens ein Kanal den Lead aufgenommen hat.
  if (!mailed && !zohoOk) {
    return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
