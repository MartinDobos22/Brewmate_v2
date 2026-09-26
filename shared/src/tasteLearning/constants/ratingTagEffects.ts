import { BAG_RATING_TAGS, type BagRatingTag } from '../../bagRatings/bagRatingTags.js';
import type { FlavorAffinities } from '../../tasteProfiles/flavorAffinitiesSchema.js';
import type { TasteAxisName } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * What a tag says about an axis.
 *
 * `liked` - this much of it was right, so at least this much. `less` - there
 * was too much of it. `more` - there was too little.
 */
export const RATING_TAG_DIRECTIONS = {
  liked: 'liked',
  less: 'less',
  more: 'more',
} as const;

export type RatingTagDirection = (typeof RATING_TAG_DIRECTIONS)[keyof typeof RATING_TAG_DIRECTIONS];

export interface RatingTagEffect {
  readonly axis?: TasteAxisName;
  readonly direction?: RatingTagDirection;
  readonly flavors?: FlavorAffinities;
}

/**
 * What each tag teaches.
 *
 * The flavours are the profile's own tag vocabulary. Nuts and caramel travel
 * together because roasters print them together and nobody tasting a cup can
 * tell them apart with confidence.
 */
export const RATING_TAG_EFFECTS: Record<BagRatingTag, RatingTagEffect> = {
  [BAG_RATING_TAGS.sweet]: { axis: 'sweetness', direction: RATING_TAG_DIRECTIONS.liked },
  [BAG_RATING_TAGS.fruity]: { flavors: { fruity: 1 } },
  [BAG_RATING_TAGS.chocolate]: { flavors: { chocolate: 1 } },
  [BAG_RATING_TAGS.nutty]: { flavors: { nutty: 1, caramel: 1 } },
  [BAG_RATING_TAGS.brightAcidity]: { axis: 'acidity', direction: RATING_TAG_DIRECTIONS.liked },
  [BAG_RATING_TAGS.fullBody]: { axis: 'body', direction: RATING_TAG_DIRECTIONS.liked },
  [BAG_RATING_TAGS.tooSour]: { axis: 'acidity', direction: RATING_TAG_DIRECTIONS.less },
  [BAG_RATING_TAGS.tooBitter]: { axis: 'bitterness', direction: RATING_TAG_DIRECTIONS.less },
  [BAG_RATING_TAGS.tooHeavy]: { axis: 'body', direction: RATING_TAG_DIRECTIONS.less },
  [BAG_RATING_TAGS.flat]: { axis: 'intensity', direction: RATING_TAG_DIRECTIONS.more },
};

/**
 * How far a "too much" or "too little" moves the target past what the coffee
 * had - about one band of the axis words, which is the smallest difference
 * anybody would put into a sentence.
 */
export const TAG_STEP = 2.5;

/**
 * How far from the middle something has to be to be noticed at all.
 *
 * A tag says the coffee had a noticeable amount of something even where the
 * label never said so: "too sour" about a coffee whose acidity the estimate
 * knows nothing about still means it sat above the middle.
 */
export const NOTICEABLE = 1.5;

/** A tag is one tap about one thing somebody tasted, so it counts in full. */
export const TAG_AXIS_WEIGHT = 1;

/**
 * How much a rating counts when the stars said nothing but a tag did.
 *
 * Three stars and "too bitter" is a real statement about bitterness, and it
 * would otherwise weigh nothing at all because three stars weigh nothing.
 */
export const TAGS_ONLY_STRENGTH = 0.5;
