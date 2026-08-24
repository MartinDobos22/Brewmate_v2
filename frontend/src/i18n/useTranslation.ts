import { interpolate, type InterpolationValues } from '../lib/text';

import { DEFAULT_LOCALE, type Locale } from './locales';
import type { TranslationKey } from './translationKeys';
import { TRANSLATIONS } from './translations';

export interface Translator {
  /**
   * A sentence, with its holes filled where it has any.
   *
   * The values are passed to the sentence rather than concatenated around it,
   * because Slovak puts a number in a different place from English and a
   * different place again from its own plural - a sentence assembled from
   * fragments at a call site is a sentence no translator ever saw.
   */
  readonly t: (key: TranslationKey, values?: InterpolationValues) => string;
  readonly locale: Locale;
}

/**
 * Minimal translation lookup. Swap the implementation for a real i18n library
 * later - call sites stay untouched because they only ever see `t(key)`.
 */
export const useTranslation = (locale: Locale = DEFAULT_LOCALE): Translator => ({
  locale,
  t: (key: TranslationKey, values?: InterpolationValues): string =>
    values === undefined
      ? TRANSLATIONS[locale][key]
      : interpolate(TRANSLATIONS[locale][key], values),
});
