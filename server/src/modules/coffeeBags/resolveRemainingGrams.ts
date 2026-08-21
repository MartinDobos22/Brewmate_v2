import { badRequestError } from '../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';

export interface BagAmounts {
  readonly weightGrams: number | null;
  readonly remainingGrams: number | null;
}

/**
 * A freshly opened bag is full, and no bag holds more than it weighs.
 *
 * Kept out of the service body because both create and update need exactly
 * this rule, applied to the values as they will be *after* the write.
 */
export const resolveRemainingGrams = ({ weightGrams, remainingGrams }: BagAmounts): number | null => {
  const resolved = remainingGrams ?? weightGrams;

  if (resolved !== null && weightGrams !== null && resolved > weightGrams) {
    throw badRequestError(ERROR_MESSAGES.remainingExceedsWeight);
  }

  return resolved;
};
