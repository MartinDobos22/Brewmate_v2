import type { BrewLog } from '@brewmate/shared';

import { MILLISECONDS_PER_DAY } from '../../../constants/time';
import { HOME_STATS } from '../constants/homeTiles';

const NOTHING = 0;
const TODAY = 0;
const LAST_OFFSET = 1;

export interface BrewWeek {
  /** One count per day, oldest first, ending with today. */
  readonly days: readonly number[];
  readonly total: number;
  /** Null when nothing was ever brewed. */
  readonly daysSinceLastBrew: number | null;
}

/** Midnight local, which is where a day boundary is for anybody reading this. */
const startOfDay = (moment: Date): number =>
  new Date(moment.getFullYear(), moment.getMonth(), moment.getDate()).getTime();

/**
 * How many days back a cup was made.
 *
 * Whole days apart rather than hours, so a cup made last night and one made
 * this morning land on different bars however few hours separate them - which
 * is how anybody reading a week of their own brewing counts it.
 */
const daysAgo = (log: BrewLog, today: number): number =>
  Math.floor((today - startOfDay(new Date(log.createdAt))) / MILLISECONDS_PER_DAY);

/**
 * The last seven days of brewing, as a row of counts.
 *
 * Derived from the page of logs the screen already holds rather than from a
 * request of its own: the page arrives newest first, so it covers the week for
 * anybody not brewing dozens of cups a day - and the tile draws a week rather
 * than claiming a total, which is the honest reading of one page.
 *
 * A log dated in the future is counted as today rather than dropped. Phone
 * clocks are wrong more often than anybody expects, and losing somebody's cup
 * over it would be the app arguing with them about whether they made coffee.
 */
export const summariseBrewWeek = (logs: readonly BrewLog[], now: Date = new Date()): BrewWeek => {
  const today = startOfDay(now);
  const ages = logs.map((log: BrewLog): number => Math.max(TODAY, daysAgo(log, today)));

  const days = Array.from(
    { length: HOME_STATS.weekDays },
    (_unused: unknown, index: number): number =>
      ages.filter((age: number): boolean => age === HOME_STATS.weekDays - LAST_OFFSET - index)
        .length,
  );

  return {
    days,
    total: days.reduce((sum: number, count: number): number => sum + count, NOTHING),
    daysSinceLastBrew: ages.length === NOTHING ? null : Math.min(...ages),
  };
};
