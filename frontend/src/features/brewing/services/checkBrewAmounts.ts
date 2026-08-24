import { readBrewerParams, type CoffeeBag, type Equipment } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import type { InterpolationValues } from '../../../lib/text';

import type { BrewAmounts } from './resolveBrewAmounts';

export interface BrewAmountWarning {
  readonly messageKey: TranslationKey;
  readonly values: InterpolationValues;
}

export interface BrewAmountCheck {
  readonly amounts: BrewAmounts;
  readonly brewer: Equipment | undefined;
  readonly bag: CoffeeBag | null;
}

/**
 * What is wrong with these numbers, said out loud rather than prevented.
 *
 * A warning rather than a block, and the difference matters: the person
 * holding the brewer knows things the app does not - that this V60 takes more
 * than the box claims, that there is another bag of the same coffee in the
 * cupboard. Refusing to continue would be the app overruling somebody about
 * their own kitchen. Saying "toľko sa ti tam nezmestí" and letting them decide
 * is the same information without the argument.
 *
 * Each warning carries the figure it is complaining about, because "too much"
 * with no number is a warning nobody can act on.
 */
export const checkBrewAmounts = ({
  amounts,
  brewer,
  bag,
}: BrewAmountCheck): readonly BrewAmountWarning[] => {
  const limits = brewer === undefined ? {} : readBrewerParams(brewer.params);
  const warnings: BrewAmountWarning[] = [];

  if (limits.capacityMl !== undefined && amounts.waterGrams > limits.capacityMl) {
    warnings.push({
      messageKey: TRANSLATION_KEYS.preBrewOverCapacity,
      values: { capacity: limits.capacityMl },
    });
  }

  if (limits.doseMaxGrams !== undefined && amounts.doseGrams > limits.doseMaxGrams) {
    warnings.push({
      messageKey: TRANSLATION_KEYS.preBrewOverDoseWindow,
      values: { max: limits.doseMaxGrams },
    });
  }

  if (limits.doseMinGrams !== undefined && amounts.doseGrams < limits.doseMinGrams) {
    warnings.push({
      messageKey: TRANSLATION_KEYS.preBrewUnderDoseWindow,
      values: { min: limits.doseMinGrams },
    });
  }

  /**
   * Only a bag somebody actually weighed can run out. A bag with no remaining
   * amount recorded is a bag nobody measured, which is a different fact from
   * an empty one - and warning about it would teach people to ignore this line.
   */
  const remaining = bag?.remainingGrams ?? null;

  if (remaining !== null && amounts.doseGrams > remaining) {
    warnings.push({
      messageKey: TRANSLATION_KEYS.preBrewOverRemaining,
      values: { remaining },
    });
  }

  return warnings;
};
