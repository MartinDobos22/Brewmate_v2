import type { CoffeeBag } from '@brewmate/shared';

import { BAG_FRESHNESS_DAYS } from '../../../constants/brewing';
import { MILLISECONDS_PER_DAY } from '../../../constants/time';

/**
 * What to do with this bag this morning.
 *
 * `unknown` is a first-class answer, not a gap: plenty of roasters print no
 * date, and a cupboard that guessed one would be telling somebody their coffee
 * is at its best on the strength of nothing.
 */
export const BAG_FRESHNESS = {
  unknown: 'unknown',
  resting: 'resting',
  ideal: 'ideal',
  pastPeak: 'pastPeak',
  aging: 'aging',
} as const;

export type BagFreshness = (typeof BAG_FRESHNESS)[keyof typeof BAG_FRESHNESS];

export interface BagAge {
  readonly freshness: BagFreshness;
  /** Null when the bag carries no roast date. */
  readonly days: number | null;
}

/**
 * How old a bag is, and which band that puts it in.
 *
 * Floored rather than rounded: a bag roasted late yesterday is one day old, not
 * two, and somebody counting days on a shelf counts the same way.
 */
export const resolveBagFreshness = (bag: CoffeeBag, now: Date = new Date()): BagAge => {
  if (bag.roastDate === null) {
    return { freshness: BAG_FRESHNESS.unknown, days: null };
  }

  const days = Math.floor((now.getTime() - Date.parse(bag.roastDate)) / MILLISECONDS_PER_DAY);

  if (!Number.isFinite(days)) {
    return { freshness: BAG_FRESHNESS.unknown, days: null };
  }

  if (days <= BAG_FRESHNESS_DAYS.restingUntil) {
    return { freshness: BAG_FRESHNESS.resting, days };
  }

  if (days <= BAG_FRESHNESS_DAYS.idealUntil) {
    return { freshness: BAG_FRESHNESS.ideal, days };
  }

  return days < BAG_FRESHNESS_DAYS.agingFrom
    ? { freshness: BAG_FRESHNESS.pastPeak, days }
    : { freshness: BAG_FRESHNESS.aging, days };
};
