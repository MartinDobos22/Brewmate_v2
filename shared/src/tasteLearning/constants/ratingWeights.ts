import { BAG_IMPRESSIONS, type BagImpression } from '../../enums/bagImpressions.js';
import { BAG_RATING_STAGES, type BagRatingStage } from '../../enums/bagRatingStages.js';

/** Three stars say nothing either way; the other four say how far. */
export const NEUTRAL_STARS = 3;
export const STAR_SPAN = 2;

/**
 * How much each moment of drinking a bag is worth.
 *
 * Halfway is the fuller answer: the bag is at its best and the recipe has
 * usually settled, so what somebody says is about the coffee. The last cups of
 * a bag are often a fortnight past their peak, and a verdict given over them
 * carries some of the staling with it.
 */
export const RATING_STAGE_TRUST: Record<BagRatingStage, number> = {
  [BAG_RATING_STAGES.halfway]: 1,
  [BAG_RATING_STAGES.finished]: 0.8,
};

/**
 * How much of a rating is about the coffee at all, by impression.
 *
 * Only one answer discounts it, and heavily: "chutí mi len niekedy, záleží na
 * recepte" says the stars were at least half about the brewing, which is not
 * what this profile is for.
 */
export const IMPRESSION_RATING_TRUST: Record<BagImpression, number> = {
  [BAG_IMPRESSIONS.asExpected]: 1,
  [BAG_IMPRESSIONS.different]: 1,
  [BAG_IMPRESSIONS.recipeDependent]: 0.5,
  [BAG_IMPRESSIONS.goodValue]: 1,
  [BAG_IMPRESSIONS.wouldNotBuy]: 1,
};

/**
 * How far the label's estimate of this coffee may be believed, by impression.
 *
 * A rating teaches through the estimate - "you liked a coffee that sits here"
 * - so a coffee that tasted different from what its label promised is exactly
 * the case where "here" is wrong. The stars still count; the place they are
 * pinned to counts for much less. The tags are not touched by this: they say
 * what the cup actually did, not what the label claimed.
 */
export const IMPRESSION_ESTIMATE_TRUST: Record<BagImpression, number> = {
  [BAG_IMPRESSIONS.asExpected]: 1,
  [BAG_IMPRESSIONS.different]: 0.3,
  [BAG_IMPRESSIONS.recipeDependent]: 1,
  [BAG_IMPRESSIONS.goodValue]: 1,
  [BAG_IMPRESSIONS.wouldNotBuy]: 1,
};

/**
 * How much of the purchase a rating leaves standing, by impression.
 *
 * Buying a bag says "this is the kind of coffee I want", and each answer here
 * is a different amount of that surviving the drinking. Exactly what they
 * wanted keeps all of it. Tasting different from what they chose keeps little,
 * because what was chosen and what was drunk were not the same coffee.
 * Depending on the recipe keeps most - the choice was sound, the brewing was
 * not. Good value keeps half, because part of the choice was the price. Never
 * again keeps none; the stars then say the rest.
 */
export const IMPRESSION_PURCHASE_FACTOR: Record<BagImpression, number> = {
  [BAG_IMPRESSIONS.asExpected]: 1,
  [BAG_IMPRESSIONS.different]: 0.3,
  [BAG_IMPRESSIONS.recipeDependent]: 0.8,
  [BAG_IMPRESSIONS.goodValue]: 0.5,
  [BAG_IMPRESSIONS.wouldNotBuy]: 0,
};

/**
 * With no impression given, the stars decide how much of the purchase stands:
 * none at one star, all of it from four up. Five stars do not make a purchase
 * worth more than it was - the rating itself carries the enthusiasm.
 */
export const FULL_PURCHASE_STARS = 4;
