import {
  BREW_METHOD_CATEGORIES,
  EMPTY_SOURCE_RECIPE,
  UNMEASURED_BREWER,
  type ConversionTarget,
  type SourceRecipe,
} from '../../src/index.js';

const V60_RATIO_MIN = 14;
const V60_RATIO_MAX = 18;
const ESPRESSO_RATIO_MIN = 1.5;
const ESPRESSO_RATIO_MAX = 3;

const CAN_SET_TEMPERATURE = true;
const CAN_GRIND = true;

/** A dripper, with nothing measured and nothing missing. */
export const V60_TARGET: ConversionTarget = {
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  ratioRange: { min: V60_RATIO_MIN, max: V60_RATIO_MAX },
  grinder: null,
  brewer: UNMEASURED_BREWER,
  hasTemperatureControl: CAN_SET_TEMPERATURE,
  canAdjustGrind: CAN_GRIND,
};

export const ESPRESSO_TARGET: ConversionTarget = {
  ...V60_TARGET,
  methodCategory: BREW_METHOD_CATEGORIES.espresso,
  ratioRange: { min: ESPRESSO_RATIO_MIN, max: ESPRESSO_RATIO_MAX },
};

/** A recipe with only the fields a test cares about filled in. */
export const sourceRecipe = (overrides: Partial<SourceRecipe>): SourceRecipe => ({
  ...EMPTY_SOURCE_RECIPE,
  ...overrides,
});

export { V60_RATIO_MIN, V60_RATIO_MAX, ESPRESSO_RATIO_MAX };
