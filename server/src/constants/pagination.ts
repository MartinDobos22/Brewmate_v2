/**
 * List queries read one row beyond the page so `hasMore` can be answered
 * without a second `count(*)` round-trip.
 */
export const EXTRA_ROW_FOR_HAS_MORE = 1;
