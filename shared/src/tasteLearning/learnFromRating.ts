import type { BagRatingTag } from '../bagRatings/bagRatingTags.js';
import type { CoffeeTasteEstimate } from '../coffeeTaste/coffeeTasteEstimateSchema.js';
import type { BagImpression } from '../enums/bagImpressions.js';
import type { BagRatingStage } from '../enums/bagRatingStages.js';
import type { TasteProfileEventPayload } from '../tasteProfiles/tasteProfileEventPayloadSchema.js';

import {
  IMPRESSION_ESTIMATE_TRUST,
  IMPRESSION_RATING_TRUST,
  NEUTRAL_STARS,
  RATING_STAGE_TRUST,
  STAR_SPAN,
} from './constants/ratingWeights.js';
import { TAGS_ONLY_STRENGTH } from './constants/ratingTagEffects.js';
import { readEstimateEvidence } from './readEstimateEvidence.js';
import { readTagEvidence } from './readTagEvidence.js';
import { resolvePurchaseFactor } from './resolvePurchaseFactor.js';

const FULL_TRUST = 1;
const NO_STRENGTH = 0;

export interface RatingInput {
  /** What the label says this coffee tastes like - the place the stars are pinned to. */
  readonly coffee: CoffeeTasteEstimate;
  readonly bagId: string;
  readonly stage: BagRatingStage;
  readonly stars: number;
  readonly impression: BagImpression | null;
  readonly tags: readonly BagRatingTag[];
}

/**
 * What a rating of one bag teaches the profile the shop reads.
 *
 * Three pieces, weighed separately because they are separately reliable. The
 * stars say how much this coffee suited somebody, and point the profile
 * towards it or away from it on the axes its label actually describes. The
 * tags say which part it was, in the cup's own terms. The impression says how
 * far to believe each: a coffee that did not taste like its label moves the
 * profile little through the label, a coffee that was only good on some
 * mornings was half about the brewing.
 *
 * Always returns an observation, even when the stars were three and nothing
 * was tapped. It still carries the bag and how much of its purchase is left
 * standing - "fine, but not what I wanted" teaches nothing about any axis and
 * a great deal about how much the choice was worth.
 */
export const learnFromRating = ({
  coffee,
  bagId,
  stage,
  stars,
  impression,
  tags,
}: RatingInput): TasteProfileEventPayload => {
  const sentiment = (stars - NEUTRAL_STARS) / STAR_SPAN;
  const estimate = readEstimateEvidence(
    coffee,
    sentiment,
    impression === null ? FULL_TRUST : IMPRESSION_ESTIMATE_TRUST[impression],
  );
  const tagged = readTagEvidence(coffee, tags);
  const strength = Math.max(
    Math.abs(sentiment),
    tags.length === 0 ? NO_STRENGTH : TAGS_ONLY_STRENGTH,
  );

  return {
    axes: { ...estimate.axes, ...tagged.axes },
    axisWeights: { ...estimate.axisWeights, ...tagged.axisWeights },
    flavorAffinities: tagged.flavorAffinities,
    weight:
      strength *
      RATING_STAGE_TRUST[stage] *
      (impression === null ? FULL_TRUST : IMPRESSION_RATING_TRUST[impression]),
    bagId,
    ratingStage: stage,
    purchaseFactor: resolvePurchaseFactor(stars, impression),
  };
};
