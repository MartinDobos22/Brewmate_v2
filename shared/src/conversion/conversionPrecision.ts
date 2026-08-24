/**
 * How much a converted number is worth.
 *
 * Three words rather than a percentage, for the same reason the taste profile
 * prints four: a conversion confidence of "0,62" invites somebody to believe
 * the second digit of an arithmetic guess about a grinder nobody has measured.
 *
 * `exact` means the number came through unchanged or was produced by
 * arithmetic that cannot be wrong - a ratio divided out of two weights.
 * `estimated` means a real calculation ran, over inputs that are approximate.
 * `unknown` means the source never said and nothing could be derived, so the
 * figure is a sensible default for the method and nothing more.
 */
export const CONVERSION_PRECISIONS = {
  exact: 'exact',
  estimated: 'estimated',
  unknown: 'unknown',
} as const;

export type ConversionPrecision =
  (typeof CONVERSION_PRECISIONS)[keyof typeof CONVERSION_PRECISIONS];
