// Routenschluessel und ihre Pfad-Segmente. Pro Schluessel ein Segment, das in
// beiden Sprachen genutzt wird (keyword-orientiert). Lokalisierte Slugs koennen
// hier spaeter je Locale ergaenzt werden, ohne die Seiten umzubauen.
export const routes = {
  home: '',
  howItWorks: 'so-funktioniert-es',
  impact: 'impact',
  whoFor: 'fuer-wen',
  services: 'leistungen',
  integrations: 'integrationen',
  locations: 'standorte',
  pricing: 'preisrechner',
  useCases: 'use-cases',
  knowledge: 'wissen',
  about: 'ueber-uns',
  contact: 'kontakt',
  book: 'termin',
  imprint: 'impressum',
  privacy: 'datenschutz',
  terms: 'agb',
} as const;

export type RouteKey = keyof typeof routes;

import type { Locale } from './config';

// Baut einen lokalisierten Pfad, z. B. path('en', 'pricing') -> /en/preisrechner
export function path(locale: Locale, key: RouteKey): string {
  const segment = routes[key];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

// Rechtsseiten haben pro Sprache eigene Slugs: DE deutsch, EN englisch.
export type LegalKey = 'imprint' | 'privacy' | 'terms';
export const legalSlugs: Record<LegalKey, Record<Locale, string>> = {
  imprint: { de: 'impressum', en: 'imprint' },
  privacy: { de: 'datenschutz', en: 'privacy' },
  terms: { de: 'agb', en: 'terms' },
};

export function legalPath(locale: Locale, key: LegalKey): string {
  return `/${locale}/${legalSlugs[key][locale]}`;
}

// hreflang-Alternates fuer eine Rechtsseite (DE- und EN-Slug verknuepft).
export function legalAlternates(key: LegalKey) {
  return {
    canonicalDe: `/de/${legalSlugs[key].de}`,
    canonicalEn: `/en/${legalSlugs[key].en}`,
    languages: {
      'de-DE': `/de/${legalSlugs[key].de}`,
      en: `/en/${legalSlugs[key].en}`,
      'x-default': `/de/${legalSlugs[key].de}`,
    },
  };
}
