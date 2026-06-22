# Deploy auf Hostinger (Node.js)

Die App läuft als Standard-Next.js-Server **oder** als self-contained Standalone-
Server. Damit deckt der Deploy beide Hostinger-Varianten ab.

## Reihenfolge im Deploy (zwingend)

1. `npm install`
2. `npm run build`  (erzeugt `.next` **und** `.next/standalone/`, kopiert
   `public` und `.next/static` in den Standalone-Ordner)
3. Start, eine der beiden Optionen:
   - **Start-Kommando:** `npm run start`  (entspricht `next start`, nutzt `PORT`)
   - **Startfile:** `.next/standalone/server.js`  (nutzt `PORT`, bindet 0.0.0.0)

## Panel-Einstellungen (gegen 503 prüfen)

- **Node-Version:** 20 oder 22 (mindestens 18.18).
- **Build command:** `npm run build`
- **Start command / Startup file:** `npm run start` **oder** `.next/standalone/server.js`
- **PORT:** nicht hart setzen, Hostinger injiziert `PORT`. Beide Start-Optionen
  lesen `process.env.PORT` automatisch.
- **RAM:** Build braucht rund 1 GB. Auf kleinen Plänen sonst OOM und kein `.next`.
- Nach dem Deploy die App **neu starten**.

## Häufige 503-Ursachen

1. Build-Schritt lief nicht (nur `npm install`), kein `.next` vorhanden.
2. Falsches Start-Kommando bzw. fehlendes Startfile.
3. Zu alte Node-Version.
4. Build OOM auf zu kleinem Plan.

## Env-Variablen (im Panel setzen, siehe .env.example)

Mindestens `NEXT_PUBLIC_SITE_URL`. Für Leads `RESEND_API_KEY`, `LEAD_INBOX`
bzw. die `ZOHO_*`-Variablen. Optional Turnstile, Plausible, Sanity, Booking-URL.
