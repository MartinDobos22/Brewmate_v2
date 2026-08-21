/** Only the primary action carries a saturated colour. */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

export type ButtonSize = 'medium' | 'small';

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_BUTTON_SIZE: ButtonSize = 'medium';

/** Which text tone each variant puts on its label. */
export const BUTTON_LABEL_TONES = {
  primary: 'onPrimary',
  secondary: 'primary',
  tertiary: 'primary',
  danger: 'onPrimary',
} as const;
