import { ANALYTICS_EVENT_NAMES, ERROR_CODES } from '@brewmate/shared';

import { trackEvent } from '../analytics';
import { ApiClientError } from '../apiClient';
import { getErrorTracker } from '../errorTracking';

const NOT_A_STATUS = 0;
const SERVER_ERROR_MIN = 500;

/**
 * Whether a failure is worth reporting.
 *
 * Almost none of them are. A 404 for a coffee that is not there, a 422 for a
 * malformed form, a 429 for an account at its ceiling and a request that never
 * left a phone in a cellar are all the app working: the person sees a Slovak
 * sentence and a retry, and sending those to an alerting tool is how a team
 * learns to ignore it.
 *
 * What is left is what nobody planned for: the server broke, or the app threw
 * something that is not a request failure at all. Those are the two cases
 * somebody should be woken up about.
 */
const isWorthReporting = (error: unknown): boolean =>
  !(error instanceof ApiClientError) || (error.status ?? NOT_A_STATUS) >= SERVER_ERROR_MIN;

/**
 * Everything that happens when a request fails, once, from one place.
 *
 * Wired into the query client rather than into each screen, so a new screen
 * cannot forget - and so the decision about what deserves reporting is made
 * once rather than argued about per feature.
 *
 * Two different things happen here, and they are deliberately not the same
 * thing. A crash goes to the error tracker so somebody can fix it. Running out
 * of model allowance goes to the funnel instead: it is not a bug, it is a
 * product question - how many people meet the ceiling, and on which feature -
 * and the answer decides whether the ceiling is set right.
 */
export const reportQueryFailure = (error: unknown, action: string): void => {
  if (error instanceof ApiClientError && error.code === ERROR_CODES.tooManyRequests) {
    trackEvent(ANALYTICS_EVENT_NAMES.aiLimitReached, { action });

    return;
  }

  if (isWorthReporting(error)) {
    getErrorTracker().capture(error, { action });
  }
};
