/** Bounds for the grinder catalogue. */
export const GRINDER_BRAND_MAX_LENGTH = 64;
export const GRINDER_MODEL_MAX_LENGTH = 80;

/** A collar setting, in whatever unit the grinder prints on itself. */
export const GRINDER_SETTING_MIN = 0;
export const GRINDER_SETTING_MAX = 10000;

/** The smallest adjustment the grinder can make. Zero would mean "stepless". */
export const GRINDER_STEP_MIN = 0;

/** Particle size in microns. Espresso starts around 200, cold brew ends near 1400. */
export const GRIND_MICRONS_MIN = 1;
export const GRIND_MICRONS_MAX = 3000;

/** Enough points to describe a curve, few enough to keep the row small. */
export const MICRON_CALIBRATION_POINTS_MAX = 32;
