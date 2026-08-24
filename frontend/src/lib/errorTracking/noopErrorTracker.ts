import type { ErrorTracker } from './errorTracker';

/**
 * What runs in a build with no DSN.
 *
 * A working state rather than a degraded one. Nothing in the app depends on a
 * crash being reported: the person in front of it already sees a Slovak
 * sentence and a retry, which is the part that matters to them.
 */
export const createNoopErrorTracker = (): ErrorTracker => ({
  capture: (): void => undefined,
});
