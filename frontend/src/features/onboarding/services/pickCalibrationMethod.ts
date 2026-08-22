import type { BrewMethod } from '@brewmate/shared';

import { CALIBRATION_METHOD_PREFERENCE } from '../constants/calibrationRecipe';

const LAST = CALIBRATION_METHOD_PREFERENCE.length;
const NOT_PREFERRED = -1;
const FIRST = 0;

const rank = (method: BrewMethod): number => {
  const index = CALIBRATION_METHOD_PREFERENCE.indexOf(method.category);

  return index === NOT_PREFERRED ? LAST : index;
};

/**
 * The method to brew the reference cup on.
 *
 * Only ever chosen from what the user owns, so the suggestion is something
 * they can act on this morning rather than a reason to go shopping.
 */
export const pickCalibrationMethod = (methods: readonly BrewMethod[]): BrewMethod | undefined =>
  [...methods].sort((first: BrewMethod, second: BrewMethod): number => rank(first) - rank(second))[
    FIRST
  ];
