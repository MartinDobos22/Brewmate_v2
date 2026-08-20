/** Every user-visible string is addressed through one of these keys. */
export const TRANSLATION_KEYS = {
  appName: 'appName',
  placeholderTitle: 'placeholderTitle',
  placeholderBody: 'placeholderBody',
} as const;

export type TranslationKey = (typeof TRANSLATION_KEYS)[keyof typeof TRANSLATION_KEYS];
