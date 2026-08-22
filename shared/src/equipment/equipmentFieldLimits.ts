/** Bounds for a piece of gear in someone's inventory. */
export const EQUIPMENT_BRAND_MAX_LENGTH = 64;
export const EQUIPMENT_MODEL_MAX_LENGTH = 80;

/**
 * Bounds for the typed corners of `equipment.params`.
 *
 * The column itself stays open - a kettle and a scale have nothing in common -
 * but the properties Brewmate actually reasons about are bounded here, so the
 * app and the API agree on what a plausible brewer looks like.
 */

/** A single cup at the low end, a batch brewer's jug at the high end. */
export const BREWER_CAPACITY_ML_MIN = 30;
export const BREWER_CAPACITY_ML_MAX = 4000;

/** Portafilter baskets run from a single ristretto basket to a triple. */
export const ESPRESSO_BASKET_MM_MIN = 40;
export const ESPRESSO_BASKET_MM_MAX = 64;

/** The smallest increment a scale reports, in grams. */
export const SCALE_RESOLUTION_GRAMS_MIN = 0.01;
export const SCALE_RESOLUTION_GRAMS_MAX = 5;
