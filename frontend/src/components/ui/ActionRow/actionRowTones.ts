import type { ColorPalette } from '../../../theme';
import type { TextTone } from '../Text';

/**
 * How loudly a row invites the tap.
 *
 * `espresso` is the one thing a screen most wants pressed, `surface` the
 * ordinary alternative beside it, and `fresh` the quieter third answer for
 * somebody the first two do not fit. Three and no more: a screen where every
 * row is coloured is a screen with no hierarchy at all.
 */
export type ActionRowTone = 'espresso' | 'surface' | 'fresh';

export const DEFAULT_ACTION_ROW_TONE: ActionRowTone = 'surface';

/** What the glyph in the circle is painted in. */
export const ACTION_ROW_ICON_COLORS = {
  espresso: 'accentOnEspresso',
  surface: 'onSurfaceVariant',
  fresh: 'onFresh',
} as const satisfies Record<ActionRowTone, keyof ColorPalette>;

/** What the chevron is painted in - the same, so the row reads as one object. */
export const ACTION_ROW_CHEVRON_COLORS = {
  espresso: 'onEspressoVariant',
  surface: 'onSurfaceVariant',
  fresh: 'onFresh',
} as const satisfies Record<ActionRowTone, keyof ColorPalette>;

export const ACTION_ROW_TITLE_TONES = {
  espresso: 'onEspresso',
  surface: 'default',
  fresh: 'fresh',
} as const satisfies Record<ActionRowTone, TextTone>;

export const ACTION_ROW_CAPTION_TONES = {
  espresso: 'onEspressoMuted',
  surface: 'muted',
  fresh: 'muted',
} as const satisfies Record<ActionRowTone, TextTone>;

export const ACTION_ROW_CHEVRON = 'chevron-right';
