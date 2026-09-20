import type { TextTone, TextVariant } from '../Text';

/** How prominent the value is: a brew timer, a recipe field, an inline stat. */
export type ValueDisplaySize = 'hero' | 'large' | 'medium';

/**
 * What it is drawn on. `espresso` is for the dark blocks the redesign puts at
 * the top of a light screen, and for brew mode - surfaces that are dark in
 * both colour schemes, so the text on them cannot take its tone from the
 * active one.
 */
export type ValueDisplayGround = 'surface' | 'espresso';

export const VALUE_VARIANTS = {
  hero: 'numericHero',
  large: 'numericLarge',
  medium: 'numericMedium',
} as const satisfies Record<ValueDisplaySize, TextVariant>;

export const UNIT_VARIANTS = {
  hero: 'numericMedium',
  large: 'numericSmall',
  medium: 'numericSmall',
} as const satisfies Record<ValueDisplaySize, TextVariant>;

export const LABEL_TONES = {
  surface: 'muted',
  espresso: 'onEspressoMuted',
} as const satisfies Record<ValueDisplayGround, TextTone>;

export const VALUE_TONES = {
  surface: 'default',
  espresso: 'onEspresso',
} as const satisfies Record<ValueDisplayGround, TextTone>;

/** What a highlighted value carries, which differs by ground for contrast. */
export const HIGHLIGHT_TONES = {
  surface: 'tertiary',
  espresso: 'accent',
} as const satisfies Record<ValueDisplayGround, TextTone>;

export const DEFAULT_VALUE_SIZE: ValueDisplaySize = 'large';
export const DEFAULT_VALUE_GROUND: ValueDisplayGround = 'surface';
