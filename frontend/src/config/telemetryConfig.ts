import { ENVIRONMENT_KEYS } from './environmentKeys';
import { readEnvironmentVariable } from './readEnvironmentVariable';

/**
 * Where crashes are reported, and which build they came from.
 *
 * A DSN is public by design - it identifies a project to receive reports and
 * authorises nothing else - which is why it may live in the bundle at all,
 * next to the Firebase client configuration and for the same reason.
 *
 * Optional, like the storage bucket and the Google client IDs: a build without
 * it reports nothing anywhere and works exactly as well. An installation that
 * would rather not hand stack traces to a third party says so by leaving the
 * variable unset.
 */
export const readErrorReportingDsn = (): string | undefined =>
  readEnvironmentVariable(ENVIRONMENT_KEYS.errorReportingDsn);

/**
 * The build a report belongs to.
 *
 * Set by the build pipeline. Without it every report from every version is one
 * undifferentiated pile, and "did the fix work?" becomes unanswerable.
 */
export const readRelease = (): string | undefined =>
  readEnvironmentVariable(ENVIRONMENT_KEYS.releaseChannel);

export const isErrorReportingConfigured = (): boolean => readErrorReportingDsn() !== undefined;
