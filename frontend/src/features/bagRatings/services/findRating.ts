import type { BagRating, BagRatingStage } from '@brewmate/shared';

/** The rating of one bag at one stage, or null where there is none yet. */
export const findRating = (
  ratings: readonly BagRating[],
  bagId: string,
  stage: BagRatingStage,
): BagRating | null =>
  ratings.find((rating: BagRating): boolean => rating.bagId === bagId && rating.stage === stage) ??
  null;
