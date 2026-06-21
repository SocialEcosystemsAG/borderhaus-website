import type { Locale } from '@/i18n/config';

type LS = Record<Locale, string>;
type LSA = Record<Locale, string[]>;

// Logo-Kacheln für die Homepage-Leiste. logo optional: fehlt die Datei, zeigt
// die Komponente den Namen als Text (kein 404). smoasters bleibt, Shopware neu.
// [PH-Logos: logo-shopware.png von Marcel, dann hier Pfad ergänzen.]
export const INTEGRATIONS: { name: string; logo?: string }[] = [
  { name: 'Shopify', logo: '/images/logo-shopify.png' },
  { name: 'WooCommerce', logo: '/images/logo-woocommerce.png' },
  { name: 'Shopware' },
  { name: 'Billbee', logo: '/images/logo-billbee.png' },
  { name: 'weclapp', logo: '/images/logo-weclapp.png' },
  { name: 'Smoasters', logo: '/images/logo-smoasters.png' },
];

// Detailkarten für die Integrationsseite (Runde 2): Logo, Einordnung, Pro,
// Contra, Anbindezeit. Inhalte wie im Briefing recherchiert.
export interface Platform {
  name: string;
  logo?: string;
  category: LS;
  pros: LSA;
  cons: LSA;
  time: LS;
}

export const PLATFORMS: Platform[] = [
  {
    name: 'Shopify',
    logo: '/images/logo-shopify.png',
    category: { de: 'Gehostete All-in-one-Lösung', en: 'Hosted all-in-one solution' },
    pros: {
      de: [
        'Schnell startklar, gehostet, kein Server-Stress',
        'Riesiges App-Ökosystem',
        'Stabiler und konvertierender Checkout, top Performance',
      ],
      en: [
        'Quick to launch, hosted, no server hassle',
        'Huge app ecosystem',
        'Stable, converting checkout, top performance',
      ],
    },
    cons: {
      de: ['Geschlossenes System, weniger tiefe Anpassung', 'Transaktionsgebühr bei externem Payment'],
      en: ['Closed system, less deep customisation', 'Transaction fee with external payment'],
    },
    time: { de: 'nativ, sehr schnell (Stunden)', en: 'native, very fast (hours)' },
  },
  {
    name: 'WooCommerce',
    logo: '/images/logo-woocommerce.png',
    category: { de: 'WordPress-Plugin, selbst gehostet', en: 'WordPress plugin, self-hosted' },
    pros: {
      de: [
        'Maximale Flexibilität und volle Kontrolle',
        'Stark bei Content und SEO',
        'Kein Plattform-Aufschlag auf Payments',
      ],
      en: ['Maximum flexibility and full control', 'Strong on content and SEO', 'No platform fee on payments'],
    },
    cons: {
      de: [
        'Selbst gehostet, du verantwortest Hosting, Updates und Sicherheit',
        'In DE oft Compliance-Plugins nötig',
      ],
      en: ['Self-hosted, you own hosting, updates and security', 'In DE often needs compliance plugins'],
    },
    time: { de: 'über Plugin und API, schnell (Stunden bis ein Tag)', en: 'via plugin and API, fast (hours to a day)' },
  },
  {
    name: 'Shopware',
    logo: undefined,
    category: { de: 'DACH-Marktführer, modular, B2B-stark', en: 'DACH market leader, modular, strong B2B' },
    pros: {
      de: [
        'Stark im DACH-Mittelstand und B2B',
        'Sehr flexibel und modular, API-first',
        'Starke eingebaute SEO- und Marketing-Tools',
      ],
      en: ['Strong in DACH mid-market and B2B', 'Very flexible and modular, API-first', 'Strong built-in SEO and marketing tools'],
    },
    cons: {
      de: ['Komplexer, eher mit Team oder Agentur', 'Ab 1 Mio Umsatz lizenzpflichtig, höherer Pflegeaufwand'],
      en: ['More complex, better with a team or agency', 'Licensed from 1M revenue, higher upkeep'],
    },
    time: { de: 'über API und Plugin, ein bis zwei Tage', en: 'via API and plugin, one to two days' },
  },
  {
    name: 'Billbee',
    logo: '/images/logo-billbee.png',
    category: { de: 'Multichannel-Auftragsverwaltung, ERP-light, DACH', en: 'Multichannel order management, ERP-light, DACH' },
    pros: {
      de: [
        'Bündelt Bestellungen aus Shop und Marktplätzen an einem Ort',
        'Schnelle Einrichtung ohne IT, über 150 Schnittstellen',
        'Starke Automatisierung, Abrechnung nach Bestellvolumen',
      ],
      en: [
        'Bundles orders from shop and marketplaces in one place',
        'Quick setup without IT, over 150 interfaces',
        'Strong automation, billing by order volume',
      ],
    },
    cons: {
      de: ['Keine eigene Buchhaltung (nur Export an DATEV oder Lexoffice)', 'Kein tiefes ERP'],
      en: ['No built-in accounting (export to DATEV or Lexoffice only)', 'No deep ERP'],
    },
    time: { de: 'nativ, sehr schnell (Stunden)', en: 'native, very fast (hours)' },
  },
  {
    name: 'weclapp',
    logo: '/images/logo-weclapp.png',
    category: { de: 'Cloud-ERP mit CRM, KMU', en: 'Cloud ERP with CRM, SME' },
    pros: {
      de: [
        'Vollständiges Cloud-ERP',
        'Bündelt CRM, Warenwirtschaft, Lager und vorbereitende Buchhaltung',
        'E-Rechnung, ISO 27001',
      ],
      en: ['Complete cloud ERP', 'Bundles CRM, inventory, warehouse and pre-accounting', 'E-invoicing, ISO 27001'],
    },
    cons: {
      de: ['Lizenz pro Nutzer und Monat', 'Weniger spezialisiert auf reine E-Commerce-Automatisierung als Billbee'],
      en: ['License per user per month', 'Less specialised on pure e-commerce automation than Billbee'],
    },
    time: { de: 'über API, ein bis zwei Tage', en: 'via API, one to two days' },
  },
  {
    name: 'REST-API',
    logo: undefined,
    category: { de: 'Für alles andere', en: 'For everything else' },
    pros: {
      de: ['Offene Schnittstelle, jede weitere Software lässt sich anbinden', 'Voll flexibel'],
      en: ['Open interface, any other software can be connected', 'Fully flexible'],
    },
    cons: {
      de: ['Etwas Entwickler-Input auf Kundenseite nötig'],
      en: ['Some developer input needed on your side'],
    },
    time: { de: 'projektabhängig', en: 'project-dependent' },
  },
];
