import { MILLISECONDS_PER_DAY } from '../../../constants/time';
import { resolveHomeHint, type HomeHint } from '../services/resolveHomeHint';

import { useBrewStats } from './useBrewStats';
import { useInventorySummary } from './useInventorySummary';

export interface HomeHintState {
  readonly hint: HomeHint;
  /**
   * False until every query behind the hint has answered.
   *
   * A hint is advice about a particular account, so one written from half the
   * evidence would tell somebody their cupboard is empty a second before it
   * fills in - and the one thing a hint has to be is right.
   */
  readonly isReady: boolean;
}

/** Whole days since the epoch: the same all day, different tomorrow. */
const today = (): number => Math.floor(Date.now() / MILLISECONDS_PER_DAY);

/** The single thing the home screen has to say, and whether it may be said yet. */
export const useHomeHint = (): HomeHintState => {
  const inventory = useInventorySummary();
  const brews = useBrewStats();

  const hint = resolveHomeHint({
    bagCount: inventory.bagCount,
    aging: inventory.aging,
    resting: inventory.resting,
    ready: inventory.ready,
    hasBrewed: brews.hasBrewed,
    daysSinceLastBrew: brews.daysSinceLastBrew,
    dayIndex: today(),
  });

  return { hint, isReady: inventory.isReady && brews.isReady };
};
