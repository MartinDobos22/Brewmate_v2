import {
  BREW_METHOD_CATEGORIES,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  WATER_TEMP_C_MAX,
  WATER_TEMP_C_MIN,
  readBrewerParams,
  type BrewMethod,
  type BrewParams,
  type Equipment,
  type RoastLevel,
  type WaterType,
} from '@brewmate/shared';

import { REFERENCE_RECIPE, ROAST_TEMPERATURE_OFFSET_C } from '../constants/referenceRecipe';

const NO_STEPS: BrewParams['steps'] = [];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** The middle of the method's own window, which is where a reference cup belongs. */
const midpointRatio = (method: BrewMethod): number =>
  (method.defaultRatioRange.min + method.defaultRatioRange.max) / REFERENCE_RECIPE.midpointDivisor;

export interface ReferenceRecipeInput {
  readonly method: BrewMethod;
  readonly brewer: Equipment | undefined;
  readonly hasTemperatureControl: boolean;
  readonly waterType: WaterType;
  /** What the drinker knows about the beans, which may be nothing. */
  readonly roastLevel: RoastLevel | null;
}

/** The temperature to propose, or `null` when the kettle cannot hold one. */
const resolveWaterTemp = (
  hasTemperatureControl: boolean,
  roastLevel: RoastLevel | null,
): number | null => {
  if (!hasTemperatureControl) {
    return null;
  }

  const offset = roastLevel === null ? 0 : ROAST_TEMPERATURE_OFFSET_C[roastLevel];

  return clamp(REFERENCE_RECIPE.waterTempC + offset, WATER_TEMP_C_MIN, WATER_TEMP_C_MAX);
};

/**
 * A cup somebody can actually make this morning.
 *
 * The dose respects whatever the brewer says it holds, and the temperature is
 * only stated when the kettle can hold one - a recipe that asks for 93 °C from
 * a kettle with an on switch is a recipe that will be missed and then blamed.
 */
export const buildReferenceParams = ({
  method,
  brewer,
  hasTemperatureControl,
  waterType,
  roastLevel,
}: ReferenceRecipeInput): BrewParams => {
  const limits = brewer === undefined ? {} : readBrewerParams(brewer.params);
  const isEspresso = method.category === BREW_METHOD_CATEGORIES.espresso;
  const wanted = isEspresso ? REFERENCE_RECIPE.espressoDoseGrams : REFERENCE_RECIPE.doseGrams;
  const doseGrams = clamp(
    wanted,
    limits.doseMinGrams ?? DOSE_GRAMS_MIN,
    limits.doseMaxGrams ?? DOSE_GRAMS_MAX,
  );
  const ratio = midpointRatio(method);

  return {
    doseGrams,
    ratio,
    waterGrams: clamp(
      doseGrams * ratio,
      WATER_GRAMS_MIN,
      Math.min(limits.capacityMl ?? WATER_GRAMS_MAX, WATER_GRAMS_MAX),
    ),
    /** Left open: the app cannot name a setting on a collar it has not seen. */
    grindSetting: null,
    waterTempC: resolveWaterTemp(hasTemperatureControl, roastLevel),
    waterType,
    steps: NO_STEPS,
  };
};
