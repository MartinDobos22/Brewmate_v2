/**
 * What somebody can say fitted or bothered them about a coffee, in one tap.
 *
 * Optional, and the reason they exist at all: stars say how much, and only
 * these say which part. "Two stars" learnt from the label's estimate can only
 * push the profile away from the whole coffee; "two stars, too sour" says the
 * acidity was the problem and nothing else was.
 *
 * Every one of them is about the coffee rather than the brew - sweetness, a
 * fruit, a weight in the mouth - because these ratings teach the profile the
 * shop reads, and a tag like "too weak" would be a recipe complaint wearing a
 * taste costume.
 */
export const BAG_RATING_TAGS = {
  sweet: 'sweet',
  fruity: 'fruity',
  chocolate: 'chocolate',
  nutty: 'nutty',
  brightAcidity: 'bright_acidity',
  fullBody: 'full_body',
  tooSour: 'too_sour',
  tooBitter: 'too_bitter',
  tooHeavy: 'too_heavy',
  flat: 'flat',
} as const;

export type BagRatingTag = (typeof BAG_RATING_TAGS)[keyof typeof BAG_RATING_TAGS];

export const BAG_RATING_TAG_VALUES = [
  BAG_RATING_TAGS.sweet,
  BAG_RATING_TAGS.fruity,
  BAG_RATING_TAGS.chocolate,
  BAG_RATING_TAGS.nutty,
  BAG_RATING_TAGS.brightAcidity,
  BAG_RATING_TAGS.fullBody,
  BAG_RATING_TAGS.tooSour,
  BAG_RATING_TAGS.tooBitter,
  BAG_RATING_TAGS.tooHeavy,
  BAG_RATING_TAGS.flat,
] as const;
