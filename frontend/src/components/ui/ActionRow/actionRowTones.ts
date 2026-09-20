import type { ColorPalette } from '../../../theme';
import type { TextTone } from '../Text';

/**
 * How loudly a row invites the tap.
 *
 * `espresso` is the one thing a screen most wants pressed, `surface` the
 * ordinary alternative beside it, and `fresh` the quieter third answer for
 * somebody the first two do not fit. Three and no more on a light screen: one
 * where every row is coloured is one with no hierarchy at all.
 *
 * `espressoInset` is the fourth, and it is not a fourth level of loudness -
 * it is the same row drawn inside an espresso block rather than on the screen
 * under it. There the browns are the other way round: the row is the deep
 * shade and its badge the lifted one, because on that ground the espresso
 * tone would be a row the same colour as what it sits on.
 */
export type ActionRowTone = 'espresso' | 'surface' | 'fresh' | 'espressoInset';

export const DEFAULT_ACTION_ROW_TONE: ActionRowTone = 'surface';

/** What the glyph in the circle is painted in. */
export const ACTION_ROW_ICON_COLORS = {
  espresso: 'accentOnEspresso',
  espressoInset: 'accentOnEspresso',
  surface: 'onSurfaceVariant',
  fresh: 'onFresh',
} as const satisfies Record<ActionRowTone, keyof ColorPalette>;

/** What the chevron is painted in - the same, so the row reads as one object. */
export const ACTION_ROW_CHEVRON_COLORS = {
  espresso: 'onEspressoVariant',
  espressoInset: 'onEspressoVariant',
  surface: 'onSurfaceVariant',
  fresh: 'onFresh',
} as const satisfies Record<ActionRowTone, keyof ColorPalette>;

export const ACTION_ROW_TITLE_TONES = {
  espresso: 'onEspresso',
  espressoInset: 'onEspresso',
  surface: 'default',
  fresh: 'fresh',
} as const satisfies Record<ActionRowTone, TextTone>;

export const ACTION_ROW_CAPTION_TONES = {
  espresso: 'onEspressoMuted',
  espressoInset: 'onEspressoMuted',
  surface: 'muted',
  fresh: 'muted',
} as const satisfies Record<ActionRowTone, TextTone>;

export const ACTION_ROW_CHEVRON = 'chevron-right';
