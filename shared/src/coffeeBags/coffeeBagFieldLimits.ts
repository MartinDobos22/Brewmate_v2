/** Bounds for a bag of coffee in someone's inventory. */
export const ROASTER_MAX_LENGTH = 80;
export const COFFEE_NAME_MAX_LENGTH = 120;
export const ORIGIN_COUNTRY_MAX_LENGTH = 56;
export const REGION_MAX_LENGTH = 80;
export const FARM_MAX_LENGTH = 120;
export const VARIETY_MAX_LENGTH = 120;

/**
 * Processing is free text, not an enum: the list is genuinely open (carbonic
 * maceration, thermal shock, whatever next season brings) and nothing in the
 * code branches on it.
 */
export const PROCESS_MAX_LENGTH = 80;

/** Metres above sea level. */
export const ALTITUDE_MIN = 0;
export const ALTITUDE_MAX = 3000;

export const TASTING_NOTE_MAX_LENGTH = 48;
export const TASTING_NOTES_MAX = 20;

export const BAG_WEIGHT_GRAMS_MIN = 1;
export const BAG_WEIGHT_GRAMS_MAX = 50000;
export const BAG_REMAINING_GRAMS_MIN = 0;

export const IMAGE_URL_MAX_LENGTH = 2048;
