const FIRST_DAY_OF_MONTH = 1;
const NEXT = 1;
const START_OF_DAY_HOUR = 0;

/** One window, and the moment it starts again. */
export interface UsageWindowBounds {
  readonly since: Date;
  readonly resetsAt: Date;
}

export interface UsageWindows {
  readonly day: UsageWindowBounds;
  readonly month: UsageWindowBounds;
}

/**
 * Where today and this month begin, in UTC.
 *
 * UTC rather than a local zone, deliberately and stated everywhere it shows.
 * A limit anchored to the phone's timezone is a limit that resets twice for
 * somebody flying west, and the server has no honest way to know which zone a
 * request came from anyway. What the app promises instead is a moment - the
 * summary carries `resetsAt` - which is unambiguous wherever it is read.
 */
export const resolveUsageWindows = (now: Date): UsageWindows => {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  return {
    day: {
      since: new Date(Date.UTC(year, month, day, START_OF_DAY_HOUR)),
      resetsAt: new Date(Date.UTC(year, month, day + NEXT, START_OF_DAY_HOUR)),
    },
    month: {
      since: new Date(Date.UTC(year, month, FIRST_DAY_OF_MONTH, START_OF_DAY_HOUR)),
      resetsAt: new Date(Date.UTC(year, month + NEXT, FIRST_DAY_OF_MONTH, START_OF_DAY_HOUR)),
    },
  };
};
