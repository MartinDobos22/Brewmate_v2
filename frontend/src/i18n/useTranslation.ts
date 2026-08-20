import { DEFAULT_LOCALE, type Locale } from './locales';
import type { TranslationKey } from './translationKeys';
import { TRANSLATIONS } from './translations';

export interface Translator {
  readonly t: (key: TranslationKey) => string;
  readonly locale: Locale;
}

/**
 * Minimal translation lookup. Swap the implementation for a real i18n library
 * later - call sites stay untouched because they only ever see `t(key)`.
 */
export const useTranslation = (locale: Locale = DEFAULT_LOCALE): Translator => ({
  locale,
  t: (key: TranslationKey): string => TRANSLATIONS[locale][key],
});
