const NOTHING = 0;
const WHOLE = 1;

/** One thing an answer said about one axis, and how far its question counts. */
export interface AxisObservation {
  readonly value: number;
  readonly weight: number;
}

export interface FoldedAxis {
  /** Where this person's cup sits, as the weighted mean of what they said. */
  readonly value: number;
  /** How much answering stands behind it, before any ceiling is applied. */
  readonly coverage: number;
  /**
   * How far the answers about this axis agreed with each other, 0..1, where 1
   * is perfect agreement and 0 is two answers pointing at opposite drinks.
   */
  readonly agreement: number;
}

const weightedMean = (observations: readonly AxisObservation[], coverage: number): number =>
  observations.reduce(
    (total: number, { value, weight }: AxisObservation): number => total + value * weight,
    NOTHING,
  ) / coverage;

/**
 * How far the answers strayed from their own mean, weighted the same way.
 *
 * Mean absolute deviation rather than a variance: with two or three
 * observations a squared measure is dominated by whichever answer is furthest
 * out, and "one of these four answers was unusual" is a different fact from
 * "these two answers contradict each other" - which is the one being measured.
 */
const weightedDeviation = (
  observations: readonly AxisObservation[],
  mean: number,
  coverage: number,
): number =>
  observations.reduce(
    (total: number, { value, weight }: AxisObservation): number =>
      total + Math.abs(value - mean) * weight,
    NOTHING,
  ) / coverage;

/**
 * Turns everything said about one axis into a position and a measure of how
 * much the answers backed each other up.
 *
 * In the contract rather than in the app, for the reason the recipe conversion
 * is: this is the arithmetic the whole product rests on - it is how a set of
 * taps becomes a claim about somebody's taste - and arithmetic that
 * consequential has to be checkable in a second, against plain values, with no
 * database, no model and no phone. It depends on nothing but numbers, so the
 * day a better measure of agreement replaces it, the replacement is one file
 * and one test file.
 *
 * Averaging is right and cancelling out is right, but they are different
 * things and the old fold could only do the first. Somebody who says they
 * dislike sour coffee and then that they want something fruity has not told us
 * they want a middling acidity - they have told us two things that point in
 * opposite directions, and the mean of the two is the single reading neither
 * answer supports. It is still the best guess available, so it is still what
 * gets recorded; what changes is that the disagreement travels with it, and
 * the chart draws that vertex as something nobody has pinned down yet rather
 * than as a considered opinion.
 */
export const foldAxisObservations = (
  observations: readonly AxisObservation[],
  maxDisagreement: number,
): FoldedAxis | null => {
  const coverage = observations.reduce(
    (total: number, { weight }: AxisObservation): number => total + weight,
    NOTHING,
  );

  if (coverage === NOTHING) {
    return null;
  }

  const value = weightedMean(observations, coverage);
  const spread = weightedDeviation(observations, value, coverage);

  return {
    value,
    coverage,
    agreement: Math.max(WHOLE - spread / maxDisagreement, NOTHING),
  };
};
