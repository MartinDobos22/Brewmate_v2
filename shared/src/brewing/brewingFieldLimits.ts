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

/** The same grind in words, for everybody whose collar Brewmate has not seen. */
export const GRIND_LABEL_MAX_LENGTH = 120;

export const BREW_STEPS_MAX = 40;
export const BREW_STEP_ORDER_MIN = 0;
export const BREW_STEP_LABEL_MAX_LENGTH = 80;
export const BREW_STEP_NOTE_MAX_LENGTH = 200;
export const BREW_STEP_AT_SECOND_MIN = 0;

/** One second at the espresso end, an hour at the cold brew end. */
export const BREW_STEP_DURATION_SECONDS_MIN = 1;
export const BREW_STEP_DURATION_SECONDS_MAX = 3600;

/**
 * How long water may sit on the puck before the pump comes up to pressure.
 *
 * Zero is a real answer - most machines have no pre-infusion at all - so the
 * floor is zero rather than one.
 */
export const PRE_INFUSION_SECONDS_MIN = 0;
export const PRE_INFUSION_SECONDS_MAX = 60;

/** One second at the espresso end, two days at the cold brew end. */
export const BREW_DURATION_SECONDS_MIN = 1;
export const BREW_DURATION_SECONDS_MAX = 172800;

export const CONSTRAINT_LABEL_MAX_LENGTH = 120;
export const CONSTRAINTS_OTHER_MAX = 10;

/** One sentence of practical advice per missing thing, and no more. */
export const CONSTRAINT_HINT_MAX_LENGTH = 300;

/** One hint per named constraint, plus room for the free-text ones. */
export const BREW_CONSTRAINT_HINTS_MAX = 12;
