import { THEME_PREFERENCES, type ThemePreference } from '../../../theme';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export interface AppearanceOption {
  readonly preference: ThemePreference;
  readonly labelKey: TranslationKey;
}

/** The three appearance choices, in the order they are shown. */
export const APPEARANCE_OPTIONS: readonly AppearanceOption[] = [
  { preference: THEME_PREFERENCES.system, labelKey: TRANSLATION_KEYS.profileAppearanceSystem },
  { preference: THEME_PREFERENCES.light, labelKey: TRANSLATION_KEYS.profileAppearanceLight },
  { preference: THEME_PREFERENCES.dark, labelKey: TRANSLATION_KEYS.profileAppearanceDark },
];
