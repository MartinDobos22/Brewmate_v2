import type { TypographyToken } from '../../../theme';

/** A text style is picked by naming a token, never by setting a size. */
export type TextVariant = TypographyToken;

/** Which colour role the text carries. */
export type TextTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'onPrimary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'inverse'
  | 'disabled';

export type TextAlign = 'left' | 'center' | 'right';

export const DEFAULT_TEXT_VARIANT: TextVariant = 'bodyMedium';
export const DEFAULT_TEXT_TONE: TextTone = 'default';
export const DEFAULT_TEXT_ALIGN: TextAlign = 'left';
