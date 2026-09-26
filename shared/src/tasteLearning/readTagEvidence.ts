import type { BagRatingTag } from '../bagRatings/bagRatingTags.js';
import type { CoffeeTasteEstimate } from '../coffeeTaste/coffeeTasteEstimateSchema.js';
import type { FlavorAffinities } from '../tasteProfiles/flavorAffinitiesSchema.js';
import type { PartialTasteAxes, TasteAxisName } from '../tasteProfiles/tasteAxesSchema.js';
import {
  isAxisKnown,
  type PartialTasteAxisConfidence,
} from '../tasteProfiles/tasteAxisConfidenceSchema.js';
import {
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  TASTE_AXIS_NEUTRAL,
} from '../tasteProfiles/tasteProfileFieldLimits.js';

import {
  NOTICEABLE,
  RATING_TAG_DIRECTIONS,
  RATING_TAG_EFFECTS,
  TAG_AXIS_WEIGHT,
  TAG_STEP,
  type RatingTagDirection,
} from './constants/ratingTagEffects.js';

export interface TagEvidence {
  readonly axes: PartialTasteAxes;
  readonly axisWeights: PartialTasteAxisConfidence;
  readonly flavorAffinities: FlavorAffinities;
}

const clampAxis = (value: number): number =>
  Math.min(Math.max(value, TASTE_AXIS_MIN), TASTE_AXIS_MAX);

/**
 * Where the preference sits, given what the coffee had and what was said
 * about it.
 *
 * Anchored on the coffee where the label knows the axis, and on a noticeable
 * amount either side of the middle where it does not - a tag is itself proof
 * there was something to notice. "Too much" is a step under what it had,
 * "too little" a step over, and "this was right" is at least what it had.
 */
const resolveTarget = (
  coffee: CoffeeTasteEstimate,
  axis: TasteAxisName,
  direction: RatingTagDirection,
): number => {
  const known = isAxisKnown(coffee.axisConfidence[axis]);
  const value = coffee.axes[axis];
  const above = TASTE_AXIS_NEUTRAL + NOTICEABLE;
  const below = TASTE_AXIS_NEUTRAL - NOTICEABLE;

  if (direction === RATING_TAG_DIRECTIONS.less) {
    return clampAxis((known ? Math.max(value, TASTE_AXIS_NEUTRAL) : above) - TAG_STEP);
  }

  if (direction === RATING_TAG_DIRECTIONS.more) {
    return clampAxis((known ? Math.min(value, TASTE_AXIS_NEUTRAL) : below) + TAG_STEP);
  }

  return known ? Math.max(value, above) : above;
};

/**
 * What the tags say, axis by axis and flavour by flavour.
 *
 * A tag speaks about the cup that was drunk, so it is taken at full weight
 * whatever the label claimed - which is also why it overrides whatever the
 * stars would have said about the same axis.
 */
export const readTagEvidence = (
  coffee: CoffeeTasteEstimate,
  tags: readonly BagRatingTag[],
): TagEvidence => {
  const axes: PartialTasteAxes = {};
  const axisWeights: PartialTasteAxisConfidence = {};
  const flavorAffinities: FlavorAffinities = {};

  for (const tag of tags) {
    const effect = RATING_TAG_EFFECTS[tag];

    if (effect.axis !== undefined && effect.direction !== undefined) {
      axes[effect.axis] = resolveTarget(coffee, effect.axis, effect.direction);
      axisWeights[effect.axis] = TAG_AXIS_WEIGHT;
    }

    Object.assign(flavorAffinities, effect.flavors);
  }

  return { axes, axisWeights, flavorAffinities };
};
