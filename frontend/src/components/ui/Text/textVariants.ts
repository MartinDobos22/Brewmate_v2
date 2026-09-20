import type { TypographyToken } from '../../../theme';

/** A text style is picked by naming a token, never by setting a size. */
export type TextVariant = TypographyToken;

/** Which colour role the text carries. */
/**
 * The last five are for text drawn on an espresso block or on brew mode's
 * ground - surfaces that are dark in both colour schemes, so the text on them
 * cannot take its colour from the active one.
 */
export type TextTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'onPrimary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'inverse'
  | 'disabled'
  | 'onEspresso'
  | 'onEspressoMuted'
  | 'accent'
  | 'accentSoft'
  | 'onCream';

export type TextAlign = 'left' | 'center' | 'right';

export const DEFAULT_TEXT_VARIANT: TextVariant = 'bodyMedium';
export const DEFAULT_TEXT_TONE: TextTone = 'default';
export const DEFAULT_TEXT_ALIGN: TextAlign = 'left';
