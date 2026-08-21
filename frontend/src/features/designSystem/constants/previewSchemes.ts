import { COLOR_SCHEMES, type ColorScheme } from '../../../theme';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/** Which schemes the screen renders: one of them, or both side by side. */
export const PREVIEW_MODES = {
  light: COLOR_SCHEMES.light,
  dark: COLOR_SCHEMES.dark,
  both: 'both',
} as const;

export type PreviewMode = (typeof PREVIEW_MODES)[keyof typeof PREVIEW_MODES];

export interface PreviewModeOption {
  readonly mode: PreviewMode;
  readonly labelKey: TranslationKey;
}

export const PREVIEW_MODE_OPTIONS: readonly PreviewModeOption[] = [
  { mode: PREVIEW_MODES.light, labelKey: TRANSLATION_KEYS.dsSchemeLight },
  { mode: PREVIEW_MODES.dark, labelKey: TRANSLATION_KEYS.dsSchemeDark },
  { mode: PREVIEW_MODES.both, labelKey: TRANSLATION_KEYS.dsSchemeBoth },
];

/** The schemes a mode expands into, left to right. */
export const SCHEMES_FOR_MODE: Record<PreviewMode, readonly ColorScheme[]> = {
  [PREVIEW_MODES.light]: [COLOR_SCHEMES.light],
  [PREVIEW_MODES.dark]: [COLOR_SCHEMES.dark],
  [PREVIEW_MODES.both]: [COLOR_SCHEMES.light, COLOR_SCHEMES.dark],
};
