import type { CoffeeBag } from '@brewmate/shared';

import { BAG_FRESHNESS, resolveBagFreshness, type BagFreshness } from '../../inventory/services';

const NOTHING = 0;

/** One bag worth naming on the home screen, and how old it is. */
export interface InventoryHighlight {
  readonly name: string;
  readonly days: number;
}

export interface InventorySummary {
  readonly bagCount: number;
  readonly readyCount: number;
  /**
   * The total left in the cupboard, or null when not one bag was ever weighed.
   *
   * Null rather than zero, because those are different facts and only one of
   * them means somebody has to go shopping. A tile that printed a confident
   * "0 g" over an unweighed cupboard would be inventing a measurement.
   */
  readonly remainingGrams: number | null;
  /** One entry per bag, in cupboard order, for the freshness strip. */
  readonly freshness: readonly BagFreshness[];
  readonly aging: InventoryHighlight | null;
  readonly resting: InventoryHighlight | null;
  readonly ready: InventoryHighlight | null;
}

interface AgedBag {
  readonly bag: CoffeeBag;
  readonly freshness: BagFreshness;
  readonly days: number | null;
}

/**
 * The oldest bag in a band, or nothing when the band is empty.
 *
 * Oldest rather than newest in every band, because the advice is the same
 * whichever band it is: the bag furthest along is the one to think about
 * first - it is the closest to being ready, or the closest to being past it.
 */
const pickOldest = (bags: readonly AgedBag[]): InventoryHighlight | null =>
  bags.reduce((oldest: InventoryHighlight | null, entry: AgedBag): InventoryHighlight | null => {
    if (entry.days === null) {
      return oldest;
    }

    return oldest !== null && oldest.days >= entry.days
      ? oldest
      : { name: entry.bag.name, days: entry.days };
  }, null);

const inBand = (bags: readonly AgedBag[], band: BagFreshness): readonly AgedBag[] =>
  bags.filter((entry: AgedBag): boolean => entry.freshness === band);

const sumRemaining = (bags: readonly CoffeeBag[]): number | null =>
  bags.reduce((total: number | null, bag: CoffeeBag): number | null => {
    if (bag.remainingGrams === null) {
      return total;
    }

    return (total ?? NOTHING) + bag.remainingGrams;
  }, null);

/** What the cupboard adds up to, read off the bags themselves. */
export const summariseInventory = (
  bags: readonly CoffeeBag[],
  now: Date = new Date(),
): InventorySummary => {
  const aged = bags.map((bag: CoffeeBag): AgedBag => ({ bag, ...resolveBagFreshness(bag, now) }));

  return {
    bagCount: bags.length,
    readyCount: inBand(aged, BAG_FRESHNESS.ideal).length,
    remainingGrams: sumRemaining(bags),
    freshness: aged.map((entry: AgedBag): BagFreshness => entry.freshness),
    aging: pickOldest(inBand(aged, BAG_FRESHNESS.aging)),
    resting: pickOldest(inBand(aged, BAG_FRESHNESS.resting)),
    ready: pickOldest(inBand(aged, BAG_FRESHNESS.ideal)),
  };
};
