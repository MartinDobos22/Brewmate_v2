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

/**
 * How far a flavour printed on the label points the profile, against one the
 * drinker tapped themselves.
 *
 * A tag somebody tapped is their own palate at full strength. A printed note
 * is the roaster's word about the lot - more specific than anything a table
 * could say, and also marketing - so a coffee loved for its "čokoláda" moves
 * the affinity for chocolate a good way towards liked, but never as far as
 * somebody saying so outright.
 */
export const NOTE_FLAVOR_AFFINITY = 0.6;
