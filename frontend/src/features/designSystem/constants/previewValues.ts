import { BREW_RATIO, DOSE_GRAMS, GRIND_SETTING, WATER_TEMPERATURE_C } from '../../../constants';

/** Sample values used to demonstrate the components. Never shown in production. */
export const PREVIEW_VALUES = {
  doseGrams: DOSE_GRAMS.default,
  brewTimeSeconds: 185,
  temperatureCelsius: WATER_TEMPERATURE_C.default,
  ratio: BREW_RATIO.filterDefault,
  grind: GRIND_SETTING.default,
} as const;

export const GRIND_RANGE = {
  min: GRIND_SETTING.min,
  max: GRIND_SETTING.max,
  step: GRIND_SETTING.step,
} as const;
