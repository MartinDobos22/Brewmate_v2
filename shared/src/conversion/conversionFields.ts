/**
 * The parts of a recipe a conversion has an opinion about.
 *
 * Machine names rather than sentences, because the report is printed beside
 * the row it is about: the note about the grind belongs under the grind, not
 * in a paragraph at the bottom that nobody maps back onto the numbers above
 * it. The same reasoning as `constraintHints`, and for the same reason.
 */
export const CONVERSION_FIELD_NAMES = [
  'grind',
  'dose',
  'water',
  'ratio',
  'temperature',
  'schedule',
  'time',
] as const;

export type ConversionField = (typeof CONVERSION_FIELD_NAMES)[number];
