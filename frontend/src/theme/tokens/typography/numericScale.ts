import { FONT_FAMILIES } from './fontFamilies';
import type { TypographyStyle } from './typographyStyle';

/**
 * Monospaced scale for measurable values. Used with tabular numerals so a
 * counting timer does not shift its own layout on every frame.
 */
export const NUMERIC_SCALE = {
  /**
   * The brew mode countdown, and nothing else.
   *
   * Sized to be read from half a metre away by somebody whose hands are wet
   * and whose glasses are in the other room. Larger than any heading in the
   * app on purpose: for the length of a brew this one number is the screen.
   */
  numericDisplay: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 88,
    lineHeight: 96,
    letterSpacing: -2,
  },
  numericHero: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1,
  },
  numericLarge: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  numericMedium: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  numericSmall: {
    fontFamily: FONT_FAMILIES.numericRegular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const satisfies Record<string, TypographyStyle>;

export type NumericScaleToken = keyof typeof NUMERIC_SCALE;
