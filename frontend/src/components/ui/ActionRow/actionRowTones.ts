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

/**
 * A tint for the glyph's disc alone, where two rows of the same tone have to
 * be told apart at a glance.
 *
 * The scanner's two intents are the case: both are ordinary answers on an
 * ordinary card, so neither may be louder than the other - but "I am standing
 * in a shop" and "I already own this" are different enough kinds of act that
 * the eye should not have to read two sentences to find the right one. It
 * recolours the disc and nothing else, so the row's own weight is untouched.
 */
export type ActionRowAccent = 'cream' | 'fresh';

export const ACTION_ROW_ACCENT_BADGES = {
  cream: 'badgeCream',
  fresh: 'badgeFreshAccent',
} as const satisfies Record<ActionRowAccent, string>;

export const ACTION_ROW_ACCENT_ICON_COLORS = {
  cream: 'onCream',
  fresh: 'onFresh',
} as const satisfies Record<ActionRowAccent, keyof ColorPalette>;
