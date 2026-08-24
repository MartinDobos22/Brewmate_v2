import { ANALYTICS_BATCH_MAX, type AnalyticsEvent } from '@brewmate/shared';

import { sendAnalyticsEvents } from './analyticsApi';
import { restoreAnalyticsQueue, takeAnalyticsQueue } from './analyticsQueue';

const NOTHING = 0;

/**
 * Sends what is waiting, in batches the API will accept.
 *
 * Everything that could not be sent goes straight back into the queue in the
 * order it happened, and a batch that fails stops the flush rather than
 * ploughing on: if the connection has gone again, the remaining batches would
 * fail too, and each attempt is a timeout somebody's phone spends waiting.
 *
 * @returns how many events were accepted.
 */
export const flushAnalytics = async (): Promise<number> => {
  const queued = await takeAnalyticsQueue();

  if (queued.length === NOTHING) {
    return NOTHING;
  }

  let sent = NOTHING;

  while (sent < queued.length) {
    const batch: readonly AnalyticsEvent[] = queued.slice(sent, sent + ANALYTICS_BATCH_MAX);

    try {
      await sendAnalyticsEvents(batch);
    } catch {
      await restoreAnalyticsQueue(queued.slice(sent));

      return sent;
    }

    sent += batch.length;
  }

  return sent;
};
