import type { TypographyToken } from '../../../theme';

/** A text style is picked by naming a token, never by setting a size. */
export type TextVariant = TypographyToken;

/** Which colour role the text carries. */
/**
 * Six of these are for text drawn on an espresso block or on brew mode's
 * ground - surfaces that are dark in both colour schemes, so the text on them
 * cannot take its colour from the active one. `positiveOnEspresso` is the
 * `fresh` of that set: a bag at its best, said on brown, where the green that
 * reads on a light screen would be unreadable.
 *
 * `fresh` and `caution` are the last two, and they are states rather than
 * palettes: a bag at its best and a bag running out of time. Deliberately not
 * `secondary` and `tertiary`, which are roles a component picks for weight -
 * these two are picked because of what is true of the thing they describe.
 */
export type TextTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'onPrimary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'onError'
  | 'inverse'
  | 'disabled'
  | 'onEspresso'
  | 'onEspressoMuted'
  | 'positiveOnEspresso'
  | 'accent'
  | 'accentSoft'
  | 'onCream'
  | 'cream'
  | 'fresh'
  | 'caution';

export type TextAlign = 'left' | 'center' | 'right';

export const DEFAULT_TEXT_VARIANT: TextVariant = 'bodyText';
export const DEFAULT_TEXT_TONE: TextTone = 'default';
export const DEFAULT_TEXT_ALIGN: TextAlign = 'left';
