# Borderhaus Website

Mehrsprachige Marketing-Site für Borderhaus, das Cross-Border-Fulfilment der
Social Ecosystems AG. Next.js (App Router) + TypeScript + Tailwind, DE/EN,
Preisrechner, Inbound-Formular, Knowledge Base (Sanity), SEO/GEO und Consent.

## Stack

- **Framework:** Next.js 15 (App Router, SSR/SSG) + TypeScript
- **Styling:** Tailwind, CI-Tokens aus Konzept A in `tailwind.config.ts`
- **Fonts:** Space Grotesk, Hanken Grotesk, Space Mono (via `next/font`, `display: swap`)
- **i18n:** `/de` und `/en` via `src/middleware.ts`, hreflang in den Metadaten
- **Knowledge Base:** Sanity (HTTP-API, dependency-frei angebunden)
- **Mail:** API-Route `src/app/api/lead` + Resend, optional CRM-Webhook
- **Analytics:** Plausible/Umami (cookielos), erst nach Consent

## Entwicklung

```bash
npm install
cp .env.example .env.local   # Werte eintragen (alles optional für den Start)
npm run dev                  # http://localhost:3000 -> /de
npm run build && npm start   # Produktion
npm run typecheck && npm run lint
```

Ohne Env-Variablen läuft alles: Leads werden in der Server-Konsole geloggt,
Analytics und Sanity sind deaktiviert.

## Projektstruktur

```
src/
  app/
    [locale]/            # alle Seiten je Sprache (DE/EN über dieselbe Struktur)
    api/lead/            # Inbound-Formular: Honeypot, Turnstile, Mail, CRM
    sitemap.ts robots.ts # XML-Sitemap + robots
  components/            # layout, home, sections, ui, calculator, forms, seo, knowledge
  config/pricing.json    # Tarif-Logik des Preisrechners (NICHT hart verdrahtet)
  i18n/                  # config, routes, Dictionaries (de = Quelle der Wahrheit)
  lib/                   # pricing, seo, sanity, site, clsx
sanity/schemas/          # Schema für Marcels Sanity Studio (separat zu deployen)
```

## Farb-Rhythmus (Abschnitt 3a, fix)

Umgesetzt in den Komponenten und über `Section`/`PageHero`:

1. Header/Nav immer schwarz (`Header.tsx`, `bg-canvas`, sticky).
2. Jede Seite startet direkt darunter hell (`PageHero`, `bg-cream`).
3. Dunkle Flächen nur als Kontrast-Anker: Proof-Leiste, Dual-Prinzip-Karte,
   CTA-Band, Footer.
4. Starke Diagramme als dunkle Feature-Karte auf hellem Grund (`HowItWorks`).
5. Cream als Standard-Light, reines Weiß für Karten (`card-light`).
6. Orange als Akzent, nicht geflutet.

## Preisrechner

- Eingaben: Bestellungen/Monat, Picks/Bestellung, Lagerbedarf, Zielmärkte,
  Gewichtsklasse, Retourenquote, Mehrwertservices.
- Logik komplett in `src/config/pricing.json` (`src/lib/pricing.ts` rechnet).
  **Aktuell Platzhalter-Tarife — echte Werte von Marcel eintragen.**
- Ausgabe: indikative Monatsspanne nach Lagerung, Pick und Pack, Versand,
  Retouren, mit Hinweis „Schätzung".
- „Angebot anfordern" reicht alle Eingaben per Query-Param an `/kontakt` durch,
  das Formular füllt die Nachricht vor.

## SEO / GEO

- Pro Seite Title, Meta, OpenGraph, Canonical, hreflang (`src/lib/seo.ts`).
- JSON-LD: Organization (Layout), LocalBusiness DE+NL (Home/Standorte),
  BreadcrumbList (alle Unterseiten), Article + FAQPage (Wissensartikel).
- `sitemap.xml`, `robots.txt`, semantisches HTML, kurze zitierbare Blöcke.

## Knowledge Base (Sanity)

1. Separates Sanity-Studio anlegen, Schemas aus `sanity/schemas` einbinden.
2. `NEXT_PUBLIC_SANITY_PROJECT_ID` etc. in `.env.local` setzen.
3. Ohne Konfiguration zeigt `/wissen` den leeren Zustand, der Build bleibt grün.

Pillar/Cluster und interne Verlinkung über das `related`-Feld im Artikel-Schema.

## Deploy (Hostinger Node.js Web Apps)

1. Repo in Hostinger mit GitHub verbinden, Framework wird erkannt.
   Build `npm run build`, Start `npm start`, Node >= 18.18.
2. Env-Variablen im Hostinger-Panel setzen (siehe `.env.example`).
3. SSL aktivieren, **borderhaus.com** als Primärdomain mappen.
4. ccTLDs **borderhaus.de/.nl/.at/.org** per 301 auf `borderhaus.com` umleiten
   (DNS/Hosting-Ebene). Sprachpfade `/de` und `/en` bleiben erhalten.

## Was Marcel noch liefern muss

- [ ] Tarif-Werte für `src/config/pricing.json`
- [ ] Mail-Empfänger (`LEAD_INBOX`) und optional CRM-Endpoint
- [ ] Brand-Assets von Claude Design (Logo als SVG -> `Logo.tsx` ersetzen, Icons)
- [ ] Finale Texte je Seite (alle `[PH]`-Stellen in `src/i18n/dictionaries`)
- [ ] Echte SLA (Proof-Punkt „Tempo"), Standort-Adressen (`src/lib/site.ts`)
- [ ] Inhalte für Impressum, Datenschutz, AGB
- [ ] Freigabe, welche Brands namentlich/mit Logo gezeigt werden dürfen
- [ ] Turnstile-Keys, Plausible-Domain, Sanity-Projekt

Alle Platzhalter im Code sind mit `[PH]` markiert.

## Hinweise / offene technische Punkte

- Keyword-Slugs wie `/cross-border-fulfillment` lassen sich später je Locale in
  `src/i18n/routes.ts` ergänzen, ohne die Seiten umzubauen.
- `next lint` ist in Next 16 entfernt; bei einem späteren Upgrade auf die
  ESLint-CLI migrieren.
