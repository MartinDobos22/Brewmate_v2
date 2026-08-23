/** How several tasting notes are written into one field. */
export const TASTING_NOTES_SEPARATOR = ',';

/** How the app writes them back into the box after reading a label. */
export const TASTING_NOTES_JOIN = ', ';

/**
 * What the days-since-roast stepper accepts.
 *
 * Days rather than a calendar date: it is the sum somebody does in their head
 * in front of a shelf, and a date picker is a poor thing to operate one-handed
 * while holding a bag of coffee.
 */
export const DAYS_SINCE_ROAST = {
  min: 0,
  max: 365,
  step: 1,
  default: 7,
} as const;
