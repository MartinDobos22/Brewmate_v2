export const LOCALES = {
  en: 'en',
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export const DEFAULT_LOCALE: Locale = LOCALES.en;
