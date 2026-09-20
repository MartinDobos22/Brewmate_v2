/**
 * Which of the two amounts somebody edited last.
 *
 * The whole reason the calculator is bidirectional: changing the ratio has to
 * move the number the person is *not* holding. Somebody who has just weighed
 * out seventeen grams of coffee and then reaches for a tighter ratio means
 * "more water", not "go and weigh the coffee again".
 */
export const AMOUNT_FIELDS = {
  dose: 'dose',
  water: 'water',
} as const;

export type AmountField = (typeof AMOUNT_FIELDS)[keyof typeof AMOUNT_FIELDS];

/** Steps for the two amounts, in grams; a domestic scale resolves no finer. */
export const AMOUNT_STEPS = {
  dose: 0.5,
  water: 5,
  espressoYield: 1,
} as const;

/**
 * The glyphs on the calculator card.
 *
 * Each names the thing its figure measures rather than the operation: a bean
 * for the dose, water for the water, a balance for the ratio between them.
 */
export const CALCULATOR_ICONS = {
  section: 'calculator-variant-outline',
  dose: 'coffee-outline',
  water: 'water-outline',
  ratio: 'scale-balance',
} as const;

/** The two glyphs on the foot bar: what is being weighed, and what happens next. */
export const FOOT_BAR_ICONS = {
  amounts: 'scale',
  submit: 'arrow-right',
} as const;
