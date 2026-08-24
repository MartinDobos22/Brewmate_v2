import {
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  readBrewerParams,
  resolveWaterGrams,
  type BrewMethod,
  type Equipment,
} from '@brewmate/shared';

import { AMOUNT_FIELDS } from '../constants/preBrew';
import { REFERENCE_RECIPE } from '../constants/referenceRecipe';

import { isEspressoMethod, midpointRatio, type BrewAmounts } from './resolveBrewAmounts';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * What the screen fills in before anybody touches it.
 *
 * Deliberately unremarkable: the middle of this method's own ratio window, at
 * a dose the brewer says it can take. The point of a proposal is not to be the
 * best cup available - nobody has told Brewmate enough for that yet - it is to
 * be a cup that works, so whatever the drinker changes about it reads as their
 * decision rather than as correcting the app.
 *
 * `lastEdited` starts on the dose, so the first pull on the ratio slider moves
 * the water. That is the right guess: somebody who has not touched anything is
 * about to weigh coffee, and the water is still in the kettle.
 */
export const proposeBrewAmounts = (
  method: BrewMethod,
  brewer: Equipment | undefined,
): BrewAmounts => {
  const limits = brewer === undefined ? {} : readBrewerParams(brewer.params);
  const wanted = isEspressoMethod(method)
    ? REFERENCE_RECIPE.espressoDoseGrams
    : REFERENCE_RECIPE.doseGrams;
  const doseGrams = clamp(
    wanted,
    limits.doseMinGrams ?? DOSE_GRAMS_MIN,
    limits.doseMaxGrams ?? DOSE_GRAMS_MAX,
  );
  const ratio = midpointRatio(method);

  return {
    doseGrams,
    ratio,
    waterGrams: resolveWaterGrams(doseGrams, ratio),
    lastEdited: AMOUNT_FIELDS.dose,
  };
};
