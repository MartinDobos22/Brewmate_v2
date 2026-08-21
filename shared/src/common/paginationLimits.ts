/**
 * Bounds for every list endpoint. Shared, so the app can never ask for a page
 * the API refuses to produce.
 */
export const LIST_LIMIT_MIN = 1;
export const LIST_LIMIT_MAX = 100;
export const LIST_LIMIT_DEFAULT = 50;
export const LIST_OFFSET_MIN = 0;
export const LIST_OFFSET_DEFAULT = 0;
