import type { CoffeeBag } from '@brewmate/shared';

import {
  groupBagsByFreshness,
  resolveBagFreshness,
  type BagFreshness,
  type BagGroup,
} from '../../inventory/services';

const FIRST = 0;

export interface SuggestedBag {
  readonly bag: CoffeeBag;
  readonly freshness: BagFreshness;
  /** Null where the bag carries no roast date to count from. */
  readonly days: number | null;
}

/**
 * The one bag worth opening this morning.
 *
 * The cupboard already answers this question - `groupBagsByFreshness` puts the
 * shelf in the order somebody standing in front of it reads it, ready first
 * and undated last - so the suggestion is the top of that list rather than a
 * second opinion about the same bags. A home screen that recommended one
 * coffee while the cupboard one tap away led with another would be two
 * screens disagreeing about a shelf they both read from the same rows.
 *
 * Which bag inside the band is a question the grouping does not answer, so it
 * is answered here and the answer is the first: the API returns the cupboard
 * newest first, and among coffees that are equally ready the one bought most
 * recently is the one somebody is most likely to have meant.
 */
export const resolveSuggestedBag = (
  bags: readonly CoffeeBag[],
  now: Date = new Date(),
): SuggestedBag | null => {
  const group: BagGroup | undefined = groupBagsByFreshness(bags, now)[FIRST];
  const bag: CoffeeBag | undefined = group?.bags[FIRST];

  if (bag === undefined) {
    return null;
  }

  return { bag, ...resolveBagFreshness(bag, now) };
};
