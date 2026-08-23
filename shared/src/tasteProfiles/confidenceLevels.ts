/**
 * How well Brewmate claims to know somebody, as a person would say it.
 *
 * Four coarse words rather than a percentage: "0,18" invites the reader to
 * believe the second digit, and there is nothing behind it.
 *
 * This lives in the contract rather than in the app because the server needs
 * the same reading. The verdict written for a shop has to admit how little it
 * knows about the person it is advising, and an app and an API that disagreed
 * about what "little" means would print a confident sentence underneath a
 * caveat, or the other way round.
 */
export const CONFIDENCE_LEVELS = {
  none: 'none',
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[keyof typeof CONFIDENCE_LEVELS];

/**
 * Where the stored `confidenceLevel` crosses from one word to the next.
 *
 * A questionnaire on its own lands around 0.12, which is deliberately still
 * "low": ten answers about chocolate and tea are a starting point, not an
 * understanding.
 */
export const CONFIDENCE_THRESHOLD_LOW = 0.05;
export const CONFIDENCE_THRESHOLD_MEDIUM = 0.35;
export const CONFIDENCE_THRESHOLD_HIGH = 0.7;

export const CONFIDENCE_THRESHOLDS = {
  low: CONFIDENCE_THRESHOLD_LOW,
  medium: CONFIDENCE_THRESHOLD_MEDIUM,
  high: CONFIDENCE_THRESHOLD_HIGH,
} as const;

/** Turns the stored confidence into the word both sides use for it. */
export const resolveConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) {
    return CONFIDENCE_LEVELS.high;
  }

  if (confidence >= CONFIDENCE_THRESHOLDS.medium) {
    return CONFIDENCE_LEVELS.medium;
  }

  return confidence >= CONFIDENCE_THRESHOLDS.low ? CONFIDENCE_LEVELS.low : CONFIDENCE_LEVELS.none;
};
