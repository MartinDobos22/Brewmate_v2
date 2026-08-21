export const LOCALES = {
  sk: 'sk',
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

/** The app ships in Slovak. Adding English means adding a file, not a search. */
export const DEFAULT_LOCALE: Locale = LOCALES.sk;
