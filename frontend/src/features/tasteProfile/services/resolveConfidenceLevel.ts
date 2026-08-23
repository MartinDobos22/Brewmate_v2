import {
  CONFIDENCE_LEVELS,
  CONFIDENCE_THRESHOLDS,
  type ConfidenceLevel,
} from '../constants/confidenceLevels';

/**
 * Turns the stored confidence into the word the profile screen shows.
 *
 * Four coarse words rather than a percentage on purpose: "0,18" invites the
 * reader to believe the second digit, and there is nothing behind it.
 */
export const resolveConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= CONFIDENCE_THRESHOLDS.high) {
    return CONFIDENCE_LEVELS.high;
  }

  if (confidence >= CONFIDENCE_THRESHOLDS.medium) {
    return CONFIDENCE_LEVELS.medium;
  }

  return confidence >= CONFIDENCE_THRESHOLDS.low ? CONFIDENCE_LEVELS.low : CONFIDENCE_LEVELS.none;
};
