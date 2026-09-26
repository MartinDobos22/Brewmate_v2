import {
  BAG_IMPRESSIONS,
  BAG_RATING_STAGES,
  BAG_RATING_TAGS,
  type BagImpression,
  type BagRatingStage,
  type BagRatingTag,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/** What the sheet asks at each moment of drinking a bag, and why. */
export const BAG_RATING_STAGE_TITLE_KEYS: Record<BagRatingStage, TranslationKey> = {
  [BAG_RATING_STAGES.halfway]: TRANSLATION_KEYS.bagRatingHalfwayTitle,
  [BAG_RATING_STAGES.finished]: TRANSLATION_KEYS.bagRatingFinishedTitle,
};

export const BAG_RATING_STAGE_BODY_KEYS: Record<BagRatingStage, TranslationKey> = {
  [BAG_RATING_STAGES.halfway]: TRANSLATION_KEYS.bagRatingHalfwayBody,
  [BAG_RATING_STAGES.finished]: TRANSLATION_KEYS.bagRatingFinishedBody,
};

/** How each stage is named on the coffee's own screen. */
export const BAG_RATING_STAGE_LABEL_KEYS: Record<BagRatingStage, TranslationKey> = {
  [BAG_RATING_STAGES.halfway]: TRANSLATION_KEYS.bagRatingCardHalfway,
  [BAG_RATING_STAGES.finished]: TRANSLATION_KEYS.bagRatingCardFinished,
};

/**
 * The impressions, in the order they are offered: from "exactly this" down to
 * "never again", so the list reads as a scale somebody can find their place
 * on rather than five unrelated sentences.
 */
export const BAG_IMPRESSION_ORDER: readonly BagImpression[] = [
  BAG_IMPRESSIONS.asExpected,
  BAG_IMPRESSIONS.different,
  BAG_IMPRESSIONS.recipeDependent,
  BAG_IMPRESSIONS.goodValue,
  BAG_IMPRESSIONS.wouldNotBuy,
];

export const BAG_IMPRESSION_LABEL_KEYS: Record<BagImpression, TranslationKey> = {
  [BAG_IMPRESSIONS.asExpected]: TRANSLATION_KEYS.bagRatingImpressionAsExpected,
  [BAG_IMPRESSIONS.different]: TRANSLATION_KEYS.bagRatingImpressionDifferent,
  [BAG_IMPRESSIONS.recipeDependent]: TRANSLATION_KEYS.bagRatingImpressionRecipeDependent,
  [BAG_IMPRESSIONS.goodValue]: TRANSLATION_KEYS.bagRatingImpressionGoodValue,
  [BAG_IMPRESSIONS.wouldNotBuy]: TRANSLATION_KEYS.bagRatingImpressionWouldNotBuy,
};

/** What fitted, and what bothered - two groups, because they are two questions. */
export const BAG_RATING_LIKED_TAGS: readonly BagRatingTag[] = [
  BAG_RATING_TAGS.sweet,
  BAG_RATING_TAGS.fruity,
  BAG_RATING_TAGS.chocolate,
  BAG_RATING_TAGS.nutty,
  BAG_RATING_TAGS.brightAcidity,
  BAG_RATING_TAGS.fullBody,
];

export const BAG_RATING_DISLIKED_TAGS: readonly BagRatingTag[] = [
  BAG_RATING_TAGS.tooSour,
  BAG_RATING_TAGS.tooBitter,
  BAG_RATING_TAGS.tooHeavy,
  BAG_RATING_TAGS.flat,
];

export const BAG_RATING_TAG_LABEL_KEYS: Record<BagRatingTag, TranslationKey> = {
  [BAG_RATING_TAGS.sweet]: TRANSLATION_KEYS.bagRatingTagSweet,
  [BAG_RATING_TAGS.fruity]: TRANSLATION_KEYS.bagRatingTagFruity,
  [BAG_RATING_TAGS.chocolate]: TRANSLATION_KEYS.bagRatingTagChocolate,
  [BAG_RATING_TAGS.nutty]: TRANSLATION_KEYS.bagRatingTagNutty,
  [BAG_RATING_TAGS.brightAcidity]: TRANSLATION_KEYS.bagRatingTagBrightAcidity,
  [BAG_RATING_TAGS.fullBody]: TRANSLATION_KEYS.bagRatingTagFullBody,
  [BAG_RATING_TAGS.tooSour]: TRANSLATION_KEYS.bagRatingTagTooSour,
  [BAG_RATING_TAGS.tooBitter]: TRANSLATION_KEYS.bagRatingTagTooBitter,
  [BAG_RATING_TAGS.tooHeavy]: TRANSLATION_KEYS.bagRatingTagTooHeavy,
  [BAG_RATING_TAGS.flat]: TRANSLATION_KEYS.bagRatingTagFlat,
};
