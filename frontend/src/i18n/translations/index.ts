import { LOCALES, type Locale } from '../locales';
import type { TranslationKey } from '../translationKeys';

import { SK_TRANSLATIONS } from './sk';

export const TRANSLATIONS: Record<Locale, Record<TranslationKey, string>> = {
  [LOCALES.sk]: SK_TRANSLATIONS,
};

export { SK_TRANSLATIONS } from './sk';
