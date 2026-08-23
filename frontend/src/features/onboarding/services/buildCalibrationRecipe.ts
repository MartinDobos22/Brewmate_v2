import {
  BREW_METHOD_CATEGORIES,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  RECIPE_SOURCES,
  WATER_GRAMS_MAX,
  WATER_GRAMS_MIN,
  readBrewerParams,
  type BrewMethod,
  type BrewParams,
  type CreateRecipeRequest,
  type Equipment,
  type WaterType,
} from '@brewmate/shared';

import { CALIBRATION_RECIPE } from '../constants/calibrationRecipe';

const NO_STEPS: BrewParams['steps'] = [];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** The middle of the method's own window, which is where a reference cup belongs. */
const midpointRatio = (method: BrewMethod): number =>
  (method.defaultRatioRange.min + method.defaultRatioRange.max) /
  CALIBRATION_RECIPE.midpointDivisor;

export interface CalibrationInput {
  readonly method: BrewMethod;
  readonly brewer: Equipment | undefined;
  readonly hasTemperatureControl: boolean;
  readonly waterType: WaterType;
}

/**
 * A cup somebody can actually make this morning.
 *
 * The dose respects whatever the brewer says it holds, and the temperature is
 * only stated when the kettle can hold one - a recipe that asks for 93 °C from
 * a kettle with an on switch is a recipe that will be missed and then blamed.
 */
export const buildCalibrationParams = ({
  method,
  brewer,
  hasTemperatureControl,
  waterType,
}: CalibrationInput): BrewParams => {
  const limits = brewer === undefined ? {} : readBrewerParams(brewer.params);
  const isEspresso = method.category === BREW_METHOD_CATEGORIES.espresso;
  const wanted = isEspresso ? CALIBRATION_RECIPE.espressoDoseGrams : CALIBRATION_RECIPE.doseGrams;
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
    waterTempC: hasTemperatureControl ? CALIBRATION_RECIPE.waterTempC : null,
    waterType,
    steps: NO_STEPS,
  };
};

/** The same cup, as the API takes it. */
export const buildCalibrationRecipe = (
  input: CalibrationInput,
  rationale: string,
): CreateRecipeRequest => ({
  methodId: input.method.id,
  equipmentIds: input.brewer === undefined ? [] : [input.brewer.id],
  params: buildCalibrationParams(input),
  rationale,
  source: RECIPE_SOURCES.calibration,
});
