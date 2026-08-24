import { useEffect, useState } from 'react';
import type { BrewMethod, Equipment } from '@brewmate/shared';

import { REFERENCE_RECIPE } from '../constants/referenceRecipe';
import { AMOUNT_FIELDS } from '../constants/preBrew';
import {
  isEspressoMethod,
  midpointRatio,
  setDose,
  setRatio,
  setWater,
  type BrewAmounts,
} from '../services/resolveBrewAmounts';
import { proposeBrewAmounts } from '../services/proposeBrewAmounts';

export interface BrewAmountsControl {
  readonly amounts: BrewAmounts;
  readonly isEspresso: boolean;
  readonly setDoseGrams: (grams: number) => void;
  readonly setWaterGrams: (grams: number) => void;
  readonly setRatioValue: (ratio: number) => void;
}

const NEUTRAL_AMOUNTS: BrewAmounts = {
  doseGrams: REFERENCE_RECIPE.doseGrams,
  waterGrams: REFERENCE_RECIPE.doseGrams * REFERENCE_RECIPE.midpointDivisor,
  ratio: REFERENCE_RECIPE.midpointDivisor,
  lastEdited: AMOUNT_FIELDS.dose,
};

/**
 * The three numbers, and the proposal they start from.
 *
 * Seeded rather than left blank: an empty form is a question, and this screen
 * has already asked enough of them. The proposal is the middle of the method's
 * own ratio window at a dose the brewer can take - unremarkable on purpose, so
 * that whatever the drinker changes reads as a decision rather than as
 * correcting the app.
 *
 * Re-seeded when the method or the brewer changes, because the proposal is
 * about that pair: switching from a V60 to an espresso basket and keeping
 * three hundred grams of water would be an obvious nonsense left on screen.
 * Once somebody has touched a number the seed is behind them, which is why
 * this watches the method rather than the amounts.
 */
export const useBrewAmounts = (
  method: BrewMethod | undefined,
  brewer: Equipment | undefined,
): BrewAmountsControl => {
  const [amounts, setAmounts] = useState<BrewAmounts>(NEUTRAL_AMOUNTS);
  const methodId = method?.id;
  const brewerId = brewer?.id;

  useEffect((): void => {
    if (method === undefined) {
      return;
    }

    setAmounts(proposeBrewAmounts(method, brewer));
    // The proposal belongs to the (method, brewer) pair, so it is re-made when
    // that pair changes and never because a number underneath it moved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodId, brewerId]);

  return {
    amounts,
    isEspresso: isEspressoMethod(method),
    setDoseGrams: (grams: number): void => {
      setAmounts(setDose(amounts, grams));
    },
    setWaterGrams: (grams: number): void => {
      setAmounts(setWater(amounts, grams));
    },
    setRatioValue: (ratio: number): void => {
      setAmounts(setRatio(amounts, ratio));
    },
  };
};

export { midpointRatio };
