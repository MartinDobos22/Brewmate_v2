/**
 * How somebody sees a bag overall, beside how many stars it got.
 *
 * Stars say how it tastes; this says what that means for having bought it. A
 * coffee that was fine but not what the label promised, one that is only good
 * on the days the recipe lands, and one that was never a ten but cost half of
 * what a ten costs are three honest answers a yes-or-no would have flattened
 * into the same "no" - and each of them should move the profile differently.
 */
export const BAG_IMPRESSIONS = {
  asExpected: 'as_expected',
  different: 'different',
  recipeDependent: 'recipe_dependent',
  goodValue: 'good_value',
  wouldNotBuy: 'would_not_buy',
} as const;

export type BagImpression = (typeof BAG_IMPRESSIONS)[keyof typeof BAG_IMPRESSIONS];

/** Tuple form, required by Drizzle's `pgEnum`. */
export const BAG_IMPRESSION_VALUES = [
  BAG_IMPRESSIONS.asExpected,
  BAG_IMPRESSIONS.different,
  BAG_IMPRESSIONS.recipeDependent,
  BAG_IMPRESSIONS.goodValue,
  BAG_IMPRESSIONS.wouldNotBuy,
] as const;
