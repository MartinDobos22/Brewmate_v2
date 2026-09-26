/**
 * When a bag is rated.
 *
 * Twice, and the two answers are different evidence. Halfway through, the bag
 * is at its best and the recipe has usually settled, so what somebody says is
 * mostly about the coffee. Once it is finished it is the verdict on the whole
 * bag - including the last week of it, when it may already have gone flat.
 */
export const BAG_RATING_STAGES = {
  halfway: 'halfway',
  finished: 'finished',
} as const;

export type BagRatingStage = (typeof BAG_RATING_STAGES)[keyof typeof BAG_RATING_STAGES];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const BAG_RATING_STAGE_VALUES = [
  BAG_RATING_STAGES.halfway,
  BAG_RATING_STAGES.finished,
] as const;
