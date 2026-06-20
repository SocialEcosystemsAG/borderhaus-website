// Zentrale i18n-Konfiguration. DE ist Standardsprache, EN zweite Sprache.
export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
};

// hreflang-Codes je Locale.
export const hreflangMap: Record<Locale, string> = {
  de: 'de-DE',
  en: 'en',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
