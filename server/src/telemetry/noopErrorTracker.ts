import type { ErrorTracker } from './errorTracker.js';

/**
 * What runs when no DSN is configured, which includes every test run.
 *
 * A working state rather than a degraded one: the log still has the error with
 * its stack, its request id and its status - that is what `pino` is for. The
 * tracker adds grouping and alerting on top of the log, and an installation
 * that does not want a third party holding its stack traces is entitled to say
 * so by leaving the variable unset.
 */
export const createNoopErrorTracker = (): ErrorTracker => ({
  capture: (): void => undefined,
});
