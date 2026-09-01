/**
 * The four numbers that decide how a coffee is compared with a person.
 *
 * All of them are about the 0-10 axis scale both sides are described on, and
 * each exists because the alternative is worse in a specific way.
 */

/**
 * How far apart a coffee and a preference have to be before they are
 * describing different drinks.
 *
 * Four points on a ten-point scale. Somebody who wants a bright cup at 8 and a
 * coffee that lands at 4 are not going to meet in the middle - that is a
 * washed Kenyan against a Brazilian espresso base. Beyond this the comparison
 * has nothing left to say except "no", so the fit bottoms out rather than
 * going on getting worse.
 */
export const MAX_MEANINGFUL_GAP = 4;

/**
 * How close counts as the same drink.
 *
 * A point either way is inside the noise of everything upstream: a weighted
 * mean of a handful of questionnaire answers against a weighted mean of a
 * handful of label signals. Calling that a mismatch would have the app
 * disagreeing with somebody over a difference neither of them could taste.
 */
export const ALIGNED_GAP = 1;

/**
 * Below this, an axis is not worth arguing from.
 *
 * The weight of a comparison is what both sides know about that axis
 * multiplied together, so this cuts off two different failures at once: an
 * axis the person has never said anything about, and an axis the label did not
 * speak to. Either one makes the comparison a comparison of two placeholders,
 * and a reason built on that is an invented reason.
 */
export const MIN_COMPARABLE_WEIGHT = 0.08;

/**
 * Where a weighted fit stops being a reason for a coffee and starts being a
 * reason against it.
 *
 * Deliberately not symmetrical around the middle. Between the two thresholds
 * the honest answer is "some of this suits you and some of it does not", which
 * is what most coffees genuinely are - and a band that snapped from yes to no
 * at 0.5 would make the app sound certain about the exact cases where it
 * should not be.
 */
export const MATCH_FIT_GOOD = 0.68;
export const MATCH_FIT_POOR = 0.42;

/**
 * How much of the five axes has to be comparable before the app claims to have
 * compared anything at all.
 *
 * Two of the five. One axis on its own is not a comparison, it is an anecdote:
 * a coffee whose acidity happens to suit somebody says nothing about whether
 * they will enjoy drinking it. Below this the match reports itself as unknown
 * and the verdict falls back to what is true of the coffee for anybody, which
 * is the same thing it does for a person nobody has measured.
 */
export const MIN_MATCH_COVERAGE = 0.4;
