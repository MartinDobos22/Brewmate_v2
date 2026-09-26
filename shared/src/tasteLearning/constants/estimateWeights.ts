/**
 * How a disliked coffee is turned into a direction.
 *
 * Disliking a very bright coffee says "less bright than that", not "the
 * opposite of that": the target is reflected across the middle of the scale
 * and pulled most of the way back towards it. A dislike is weaker evidence of
 * where somebody is than a like is, because it only rules out one place.
 */
export const DISLIKE_REFLECTION = 0.6;

/**
 * Half the width of the scale, which is how far an axis can sit from the
 * middle. A disliked coffee that sat exactly in the middle of an axis says
 * nothing about that axis, and one at an end says the most.
 */
export const HALF_SCALE = 5;
