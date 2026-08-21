import { SK_TRANSLATIONS } from './translations/sk';

export type TranslationKey = keyof typeof SK_TRANSLATIONS;

/** Maps every translation key onto itself: `{ tabHome: 'tabHome', ... }`. */
type KeyMap<TSource> = { readonly [TKey in keyof TSource]: TKey };

const buildKeyMap = <TSource extends Record<string, string>>(source: TSource): KeyMap<TSource> => {
  const entries = Object.keys(source).map((key: string): readonly [string, string] => [key, key]);

  // Safe: `Object.keys(source)` yields exactly `keyof TSource`, and each key is
  // mapped onto itself, which is precisely what `KeyMap<TSource>` describes.
  // TypeScript cannot express that through `Object.fromEntries`.
  // eslint-disable-next-line no-restricted-syntax
  return Object.fromEntries(entries) as KeyMap<TSource>;
};

/**
 * Every user-visible string is addressed through one of these keys, so a typo
 * is a compile error rather than an empty label at runtime.
 */
export const TRANSLATION_KEYS = buildKeyMap(SK_TRANSLATIONS);
