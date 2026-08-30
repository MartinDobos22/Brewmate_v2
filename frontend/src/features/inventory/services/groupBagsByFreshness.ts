import type { CoffeeBag } from '@brewmate/shared';

import { BAG_FRESHNESS, resolveBagFreshness, type BagFreshness } from './resolveBagFreshness';

export interface BagGroup {
  readonly freshness: BagFreshness;
  readonly bags: readonly CoffeeBag[];
}

/**
 * The order the cupboard is read in, which is not the order the bags arrived.
 *
 * It answers "what do I drink this morning" from the top down: what is ready
 * now, what will be lost if it keeps waiting, what is still fine, what is not
 * ready yet, and what carries no roast date to judge by at all. Newest-first -
 * which is what the API returns and what this screen used to print - answers a
 * question nobody standing at a shelf is asking.
 */
const GROUP_ORDER: readonly BagFreshness[] = [
  BAG_FRESHNESS.ideal,
  BAG_FRESHNESS.aging,
  BAG_FRESHNESS.pastPeak,
  BAG_FRESHNESS.resting,
  BAG_FRESHNESS.unknown,
];

const NOTHING = 0;

/**
 * The cupboard, grouped by what to do with each bag this morning.
 *
 * An empty band is left out rather than printed as a heading with nothing
 * under it: a cupboard with no resting coffee in it has nothing to say about
 * resting coffee.
 */
export const groupBagsByFreshness = (
  bags: readonly CoffeeBag[],
  now: Date = new Date(),
): readonly BagGroup[] =>
  GROUP_ORDER.map((freshness: BagFreshness): BagGroup => ({
    freshness,
    bags: bags.filter(
      (bag: CoffeeBag): boolean => resolveBagFreshness(bag, now).freshness === freshness,
    ),
  })).filter((group: BagGroup): boolean => group.bags.length > NOTHING);
