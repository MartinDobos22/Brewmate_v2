import { readErrorReportingDsn, readRelease } from '../../config';

import type { ErrorTracker } from './errorTracker';
import { createNoopErrorTracker } from './noopErrorTracker';
import { parseSentryDsn } from './parseSentryDsn';
import { createSentryErrorTracker } from './sentryErrorTracker';

let tracker: ErrorTracker | null = null;

/**
 * The one reporter the app uses, built on first use.
 *
 * Lazy rather than at module load, so importing anything that reports errors
 * does not read the environment on the way past - and so a test can exercise
 * the modules around it without a network client existing at all.
 *
 * A missing or malformed DSN both give the reporter that does nothing. Neither
 * is a failure worth telling somebody about while they are making coffee: what
 * they see either way is the Slovak sentence and the retry the screen already
 * had.
 */
export const getErrorTracker = (): ErrorTracker => {
  if (tracker !== null) {
    return tracker;
  }

  const configured = readErrorReportingDsn();
  const dsn = configured === undefined ? null : parseSentryDsn(configured);

  tracker =
    dsn === null
      ? createNoopErrorTracker()
      : createSentryErrorTracker({ dsn, release: readRelease() });

  return tracker;
};
