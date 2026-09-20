/** The two glyphs the stepper draws. Not copy - they are the same in every language. */
export const STEPPER_SYMBOLS = {
  decrease: '−',
  increase: '+',
} as const;

/**
 * The glyphs the calculator variant uses instead of the characters above.
 *
 * A minus sign set in type and a round button carrying a minus glyph are two
 * different controls: the first is a character that happens to be pressable,
 * the second is a button. On the one screen where the numbers are the largest
 * thing in the app, the buttons have to look like buttons.
 */
export const STEPPER_ICONS = {
  decrease: 'minus',
  increase: 'plus',
} as const;
