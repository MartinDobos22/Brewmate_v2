import type { AnalyticsEventName, AnalyticsProperties } from '@brewmate/shared';

import { enqueueAnalyticsEvent } from './analyticsQueue';

/**
 * Records that somebody reached a step.
 *
 * Deliberately fire-and-forget and deliberately unable to fail: nothing in
 * this app should ever be slower, or break, because a funnel wanted a row.
 * The event goes on disk and is sent later by whatever flush comes next.
 *
 * The properties are short machine values - a method key, a count, a flag -
 * and never anything somebody typed. A coffee's name, a note about a cup and a
 * search term all belong to the person who wrote them; this table has no
 * business holding any of them, and the shared schema refuses free text for
 * exactly that reason.
 */
export const trackEvent = (name: AnalyticsEventName, properties?: AnalyticsProperties): void => {
  void enqueueAnalyticsEvent({
    name,
    /**
     * The phone's clock. These are queued while offline and flushed later, so
     * stamping them on arrival would report a morning's brewing as having
     * happened all at once that evening.
     */
    occurredAt: new Date().toISOString(),
    ...(properties === undefined ? {} : { properties }),
  }).catch((): void => undefined);
};
