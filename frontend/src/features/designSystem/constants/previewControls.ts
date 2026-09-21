import type { PillSize, PillTone } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * Every tone and every size a pill can be, listed so the catalogue cannot
 * fall behind the component.
 *
 * Written out rather than derived from the maps in `pillButtonTones`, because
 * the order here is an argument - the two light-ground tones, the two
 * espresso ones, the two specials, then the one that belongs to no pair - and
 * `Object.keys` would print them in whatever order somebody last edited.
 */
export const PREVIEW_PILL_TONES: readonly PillTone[] = [
  'espresso',
  'surface',
  'cream',
  'lifted',
  'surfaceLead',
  'faint',
  'danger',
];

export const PREVIEW_PILL_TONE_LABELS: Record<PillTone, TranslationKey> = {
  espresso: TRANSLATION_KEYS.dsToneEspresso,
  surface: TRANSLATION_KEYS.dsToneSurface,
  cream: TRANSLATION_KEYS.dsToneCream,
  lifted: TRANSLATION_KEYS.dsToneLifted,
  surfaceLead: TRANSLATION_KEYS.dsToneSurfaceLead,
  faint: TRANSLATION_KEYS.dsToneFaint,
  danger: TRANSLATION_KEYS.dsToneDanger,
};

/** The two tones drawn on brown, which need the espresso ground behind them. */
export const PREVIEW_ESPRESSO_TONES: readonly PillTone[] = ['cream', 'lifted'];

export const PREVIEW_PILL_SIZES: readonly PillSize[] = ['large', 'medium', 'small', 'compact'];

export const PREVIEW_PILL_SIZE_LABELS: Record<PillSize, TranslationKey> = {
  large: TRANSLATION_KEYS.dsSizeLarge,
  medium: TRANSLATION_KEYS.dsSizeMedium,
  small: TRANSLATION_KEYS.dsSizeSmall,
  compact: TRANSLATION_KEYS.dsSizeCompact,
};

/** The glyph every preview pill carries, so the mark's spacing is checkable. */
export const PREVIEW_PILL_ICON = 'coffee-outline';
