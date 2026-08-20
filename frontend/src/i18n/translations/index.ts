import { LOCALES, type Locale } from '../locales';
import type { TranslationKey } from '../translationKeys';

import { EN_TRANSLATIONS } from './en';

export const TRANSLATIONS: Record<Locale, Record<TranslationKey, string>> = {
  [LOCALES.en]: EN_TRANSLATIONS,
};
