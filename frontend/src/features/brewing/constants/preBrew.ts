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
