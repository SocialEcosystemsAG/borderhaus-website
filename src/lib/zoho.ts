// Zoho CRM Lead-Anlage in die GEMEINSAME Org wie Smoasters (Social Ecosystems AG,
// EU-Datacenter). Refresh-Token-Flow mit Token-Caching. Komplett env-gesteuert:
// ohne Zugangsdaten ist die Funktion ein No-op und der Mail-Fallback greift.
//
// TODO Marcel: folgende Env-Variablen in der Borderhaus-App bei Hostinger setzen
// (gleiche Werte wie Smoasters, da gleiche Org):
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_DC_REGION=eu
//   ZOHO_FIELD_LEAD_ENGINE=Lead_Engine, ZOHO_FIELD_BRAND=Brand,
//   ZOHO_FIELD_LEAD_TYPE=Lead_Typ

const REGION = (process.env.ZOHO_DC_REGION || 'eu').toLowerCase();
const ACCOUNTS = process.env.ZOHO_ACCOUNTS_DOMAIN || `https://accounts.zoho.${REGION}`;
const API = process.env.ZOHO_API_DOMAIN || `https://www.zohoapis.${REGION}`;

// Custom-Field-API-Namen (überschreibbar per Env).
const F_ENGINE = process.env.ZOHO_FIELD_LEAD_ENGINE || 'Lead_Engine';
const F_BRAND = process.env.ZOHO_FIELD_BRAND || 'Brand';
const F_TYPE = process.env.ZOHO_FIELD_LEAD_TYPE || 'Lead_Typ';
const F_SOURCE = process.env.ZOHO_FIELD_QUELLE || 'Quelle_Lead_Source';

// Pflicht-Kennzeichen fuer Borderhaus-Leads (fest, nicht Smoasters).
const BRAND_VALUE = 'Borderhaus';
const LEAD_TYPE_VALUE = 'Fulfilment';
const LEAD_ENGINE_VALUE = 'Inbound';

// Mapping der Formular-Quelle auf bestehende Quelle_Lead_Source-Picklistwerte.
// "Anfrage"/"Kontakt" existieren in der Picklist nicht, daher auf die
// vorhandene Taxonomie gemappt. [TODO Marcel: falls eigene Werte gewuenscht,
// in Zoho zur Picklist Quelle_Lead_Source ergaenzen, dann hier eintragen.]
const SOURCE_MAP: Record<string, string> = {
  'book-a-call': 'Book-a-call',
  kontakt: 'Get-started',
  anfrage: 'Get-started',
};
function mapSource(source?: string): string {
  return (source && SOURCE_MAP[source]) || 'Get-started';
}

export function isZohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN,
  );
}

// In-Memory Token-Cache (pro Server-Instanz).
let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cachedToken.exp) return cachedToken.token;
  const body = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN as string,
    client_id: process.env.ZOHO_CLIENT_ID as string,
    client_secret: process.env.ZOHO_CLIENT_SECRET as string,
    grant_type: 'refresh_token',
  });
  try {
    const res = await fetch(`${ACCOUNTS}/oauth/v2/token`, { method: 'POST', body });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) return null;
    const ttl = (data.expires_in ?? 3600) - 60; // Sicherheitsabstand
    cachedToken = { token: data.access_token, exp: Date.now() + ttl * 1000 };
    return cachedToken.token;
  } catch {
    return null;
  }
}

export interface LeadData {
  name?: string;
  email?: string;
  brand?: string; // Company
  website?: string;
  shopSystem?: string;
  volume?: string;
  markets?: string;
  message?: string;
  source?: string; // welches Formular: kontakt | anfrage | book-a-call
}

// Legt einen Lead im Leads-Modul an, klar als Borderhaus gekennzeichnet.
export async function createZohoLead(lead: LeadData): Promise<boolean> {
  if (!isZohoConfigured()) return false;
  const token = await getAccessToken();
  if (!token) return false;

  const descriptionParts = [
    lead.message,
    lead.shopSystem ? `Shopsystem: ${lead.shopSystem}` : null,
    lead.volume ? `Volumen: ${lead.volume}` : null,
    lead.markets ? `Zielmaerkte: ${lead.markets}` : null,
  ].filter(Boolean);

  const record: Record<string, unknown> = {
    Last_Name: lead.name?.trim() || lead.brand?.trim() || 'Website Lead',
    Company: lead.brand?.trim() || 'Unbekannt',
    Description: descriptionParts.join('\n'),
    [F_ENGINE]: LEAD_ENGINE_VALUE,
    [F_BRAND]: BRAND_VALUE,
    [F_TYPE]: LEAD_TYPE_VALUE,
    [F_SOURCE]: mapSource(lead.source),
  };
  if (lead.email) record.Email = lead.email;
  if (lead.website) record.Website = lead.website;

  try {
    const res = await fetch(`${API}/crm/v3/Leads`, {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [record], trigger: ['workflow'] }),
    });
    if (!res.ok) {
      console.error('[zoho] Lead-Anlage fehlgeschlagen', res.status, await res.text());
      return false;
    }
    const json = (await res.json()) as { data?: { code?: string }[] };
    const ok = json.data?.[0]?.code === 'SUCCESS';
    if (!ok) console.error('[zoho] Lead nicht angelegt', JSON.stringify(json));
    return ok;
  } catch (err) {
    console.error('[zoho] Lead-Anlage Fehler', err);
    return false;
  }
}
