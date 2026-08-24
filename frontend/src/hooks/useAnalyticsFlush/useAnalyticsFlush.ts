import { useEffect } from 'react';

import { ANALYTICS_FLUSH_INTERVAL_MS } from '../../constants/analytics';
import { flushAnalytics } from '../../lib/analytics';
import { useIsOnline } from '../useIsOnline';

/**
 * Empties the analytics queue whenever it can be emptied.
 *
 * Driven by coming back online rather than by a timer, because that is the
 * only event that changes the answer - the interval underneath is a backstop
 * for a long session that never goes offline and would otherwise hold its last
 * few events until the app was next opened.
 *
 * A failure here is silent by design. Telemetry that could interrupt somebody
 * making coffee would be telemetry worth removing.
 */
export const useAnalyticsFlush = (): void => {
  const isOnline = useIsOnline();

  useEffect((): (() => void) | undefined => {
    if (!isOnline) {
      return undefined;
    }

    void flushAnalytics();

    const interval = setInterval((): void => {
      void flushAnalytics();
    }, ANALYTICS_FLUSH_INTERVAL_MS);

    return (): void => {
      clearInterval(interval);
    };
  }, [isOnline]);
};
