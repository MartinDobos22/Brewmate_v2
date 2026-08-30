import type { BrewLog } from '@brewmate/shared';

import { useBrewLogs } from '../../brewing/hooks';
import { HOME_STATS } from '../constants/homeTiles';
import { summariseBrewWeek, type BrewWeek } from '../services/summariseBrewWeek';

const NO_LOGS: readonly BrewLog[] = [];
const NOTHING = 0;
const RECENT_PAGE = { limit: HOME_STATS.brewLogPage } as const;

export interface BrewStats extends BrewWeek {
  /** Whether anything was ever brewed, which one page answers exactly. */
  readonly hasBrewed: boolean;
  readonly isReady: boolean;
}

/**
 * The last week of brewing, and whether there has been any at all.
 *
 * The tile draws a week rather than a lifetime total on purpose. One page of
 * logs cannot honestly say how many cups an account has ever made, and the
 * profile's own brew count means something else again - it counts the cups
 * that were described, not the cups that were brewed. A number on a tile that
 * needs a paragraph to explain it is a number that will be misread.
 */
export const useBrewStats = (): BrewStats => {
  const logs = useBrewLogs(RECENT_PAGE);
  const items = logs.data?.items ?? NO_LOGS;

  return {
    ...summariseBrewWeek(items),
    hasBrewed: items.length > NOTHING,
    isReady: logs.isSuccess,
  };
};
