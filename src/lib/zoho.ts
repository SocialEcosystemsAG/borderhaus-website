// Zoho CRM Lead-Anlage über OAuth-Refresh-Token (EU-Domain standardmäßig).
// Komplett env-gesteuert: ohne Zugangsdaten ist die Funktion ein No-op und der
// Mail-Fallback in der API-Route greift. [PH: Self-Client von Marcel.]

const ACCOUNTS = process.env.ZOHO_ACCOUNTS_DOMAIN || 'https://accounts.zoho.eu';
const API = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.eu';

export function isZohoConfigured(): boolean {
  return Boolean(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN);
}

async function getAccessToken(): Promise<string | null> {
  const body = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN as string,
    client_id: process.env.ZOHO_CLIENT_ID as string,
    client_secret: process.env.ZOHO_CLIENT_SECRET as string,
    grant_type: 'refresh_token',
  });
  try {
    const res = await fetch(`${ACCOUNTS}/oauth/v2/token`, { method: 'POST', body });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export interface LeadData {
  name?: string;
  email?: string;
  brand?: string; // Company
  shopSystem?: string;
  volume?: string;
  markets?: string;
  message?: string;
  source?: string; // welche Seite
}

// Legt einen Lead im Modul Leads an. Gibt true bei Erfolg zurück.
export async function createZohoLead(lead: LeadData): Promise<boolean> {
  if (!isZohoConfigured()) return false;
  const token = await getAccessToken();
  if (!token) return false;

  const descriptionParts = [
    lead.message,
    lead.shopSystem ? `Shopsystem: ${lead.shopSystem}` : null,
    lead.volume ? `Volumen: ${lead.volume}` : null,
    lead.markets ? `Zielmärkte: ${lead.markets}` : null,
    lead.source ? `Quelle: ${lead.source}` : null,
  ].filter(Boolean);

  const record: Record<string, unknown> = {
    Last_Name: lead.name?.trim() || lead.brand?.trim() || 'Website Lead',
    Company: lead.brand?.trim() || 'Unbekannt',
    Lead_Source: lead.source || 'Borderhaus Website',
    Description: descriptionParts.join('\n'),
  };
  if (lead.email) record.Email = lead.email;

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
    return true;
  } catch (err) {
    console.error('[zoho] Lead-Anlage Fehler', err);
    return false;
  }
}
