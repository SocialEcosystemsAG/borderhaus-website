import type { Locale } from './config';
import de, { type Dictionary } from './dictionaries/de';
import en from './dictionaries/en';

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.de;
}

export type { Dictionary };
