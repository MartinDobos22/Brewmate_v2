import type { TextVariant } from '../Text';

/** How prominent the value is: a brew timer, a recipe field, an inline stat. */
export type ValueDisplaySize = 'hero' | 'large' | 'medium';

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

export const DEFAULT_VALUE_SIZE: ValueDisplaySize = 'large';
