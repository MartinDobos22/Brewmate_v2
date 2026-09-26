import type { BagImpression } from '../enums/bagImpressions.js';
import { CONFIDENCE_MAX, CONFIDENCE_MIN } from '../tasteProfiles/tasteProfileFieldLimits.js';

import { FULL_PURCHASE_STARS, IMPRESSION_PURCHASE_FACTOR } from './constants/ratingWeights.js';

const ONE_STAR = 1;

/**
 * How much of having bought a bag a rating of it leaves standing, 0..1.
 *
 * The impression decides where there is one, because it is the answer to
 * exactly this question - "I liked it, but it was not what I chose it for"
 * says more about the purchase than any number of stars. Without one, the
 * stars decide: one star leaves nothing of the choice, and from four up all
 * of it stands.
 */
export const resolvePurchaseFactor = (stars: number, impression: BagImpression | null): number => {
  if (impression !== null) {
    return IMPRESSION_PURCHASE_FACTOR[impression];
  }

  const share = (stars - ONE_STAR) / (FULL_PURCHASE_STARS - ONE_STAR);

  return Math.min(Math.max(share, CONFIDENCE_MIN), CONFIDENCE_MAX);
};
