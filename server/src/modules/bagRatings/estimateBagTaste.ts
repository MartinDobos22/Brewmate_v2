import {
  estimateCoffeeTaste,
  readCoffeeSignals,
  toModelSignal,
  type CoffeeBag,
  type CoffeeTasteEstimate,
  type CoffeeTasteSignal,
} from '@brewmate/shared';

import { normalizeLabelKey } from '../ai/coffeeBagParse/normalizeLabelKey.js';
import type { CoffeeTasteReadingRepository } from '../ai/coffeeTasteEstimate/coffeeTasteReadingRepository.js';

/**
 * What a bag in the cupboard probably tastes like, on the profile's own axes.
 *
 * The same arithmetic the scanner runs, and the same rule the shop verdict
 * follows about the model: its reading of this label is used where one has
 * already been bought and cached, and never bought here. Rating a coffee is
 * free, and has to stay free.
 */
export const estimateBagTaste = async (
  bag: CoffeeBag,
  readings: CoffeeTasteReadingRepository,
): Promise<CoffeeTasteEstimate> => {
  const roasterKey = normalizeLabelKey(bag.roaster);
  const nameKey = normalizeLabelKey(bag.name);
  const cached =
    roasterKey === null || nameKey === null
      ? null
      : await readings.findByLabel({ roasterKey, nameKey });
  const signals: readonly CoffeeTasteSignal[] = [
    ...readCoffeeSignals(bag),
    ...(cached === null ? [] : [toModelSignal(cached.reading)]),
  ];

  return estimateCoffeeTaste(signals);
};
