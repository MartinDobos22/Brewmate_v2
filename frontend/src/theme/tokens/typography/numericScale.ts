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
   *
   * It sits inside the pour ring rather than above it now, so it is set to the
   * width the ring leaves it - and tracked in hard, because four mono digits
   * at this size are mostly the space between them.
   */
  numericDisplay: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 76,
    lineHeight: 78,
    letterSpacing: -3,
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
  /**
   * The figure somebody is adjusting, which is the largest thing on its
   * screen because it is the thing the screen is for.
   */
  numericCalculator: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -2,
  },
  /** Three figures across the top of a screen, summing up what is below. */
  numericSummary: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1.5,
  },
  /**
   * Three figures across an espresso header, summing up what the screen below
   * is about. Smaller than the summary strip on a light ground: the header
   * already has the whole width and the contrast to be read without it.
   */
  numericHeader: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -1,
  },
  /** The figure inside a dial, sized to the hole the ring leaves it. */
  numericDial: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 21,
    lineHeight: 23,
    letterSpacing: -0.6,
  },
  /** A measured value inside a chip or beside a label. */
  numericValue: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  /** The plan on a foot bar, which must fit on one line whatever it says. */
  numericFoot: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  /** A measured value set in a line of text rather than given a column. */
  numericInline: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.4,
  },
  /** The value a row of a table settles on, beside the one it replaced. */
  numericRow: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
  },
  /** A figure read after the one above it - a total under a countdown. */
  numericCaption: {
    fontFamily: FONT_FAMILIES.numericRegular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  /** A count beside a progress bar, at the size of a label rather than a value. */
  numericLabel: {
    fontFamily: FONT_FAMILIES.numericMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
} as const satisfies Record<string, TypographyStyle>;

export type NumericScaleToken = keyof typeof NUMERIC_SCALE;
