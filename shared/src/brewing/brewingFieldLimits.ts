/**
 * Physical bounds of a brew. Shared by recipes, brew logs and chat patches,
 * so a value the app lets someone enter is a value the API accepts.
 */
export const DOSE_GRAMS_MIN = 1;
export const DOSE_GRAMS_MAX = 500;

export const WATER_GRAMS_MIN = 1;
export const WATER_GRAMS_MAX = 5000;

/** Parts of water per part of coffee. */
export const BREW_RATIO_MIN = 1;
export const BREW_RATIO_MAX = 100;

export const WATER_TEMP_C_MIN = 1;
export const WATER_TEMP_C_MAX = 100;

/** In the unit the grinder itself is marked in; comparison goes through microns. */
export const GRIND_SETTING_MIN = 0;
export const GRIND_SETTING_MAX = 10000;

export const BREW_STEPS_MAX = 40;
export const BREW_STEP_ORDER_MIN = 0;
export const BREW_STEP_LABEL_MAX_LENGTH = 80;
export const BREW_STEP_NOTE_MAX_LENGTH = 200;
export const BREW_STEP_AT_SECOND_MIN = 0;

/** One second at the espresso end, two days at the cold brew end. */
export const BREW_DURATION_SECONDS_MIN = 1;
export const BREW_DURATION_SECONDS_MAX = 172800;

export const CONSTRAINT_LABEL_MAX_LENGTH = 120;
export const CONSTRAINTS_OTHER_MAX = 10;
