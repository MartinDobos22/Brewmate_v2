import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * How the mark on the signed-out screens breathes.
 *
 * The only animation in the app that runs with nothing happening, and slow
 * enough to be felt rather than watched: six seconds a cycle and three per
 * cent of its own size. Anything faster reads as a spinner, which would be
 * the screen claiming to be busy while it waits for somebody to type.
 */
export const BRAND_BREATH = {
  scale: 1.03,
  durationMs: 6000,
} as const;

/**
 * The glyph beside each field's label, and on the buttons.
 *
 * A label on a dark field is set small and tracked out, which makes it quiet -
 * quiet enough that a column of two reads as one block of text. The mark is
 * what turns each back into a heading for the box under it.
 */
export const AUTH_ICONS = {
  email: 'email-outline',
  password: 'lock-outline',
  reveal: 'eye-outline',
  conceal: 'eye-off-outline',
  submit: 'arrow-right',
  google: 'google',
} as const satisfies Record<string, MaterialIconName>;
