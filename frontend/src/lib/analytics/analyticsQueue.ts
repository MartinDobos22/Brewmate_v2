import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyticsEventSchema, type AnalyticsEvent } from '@brewmate/shared';
import { z } from 'zod';

import { ANALYTICS_QUEUE_MAX } from '../../constants/analytics';
import { STORAGE_KEYS } from '../../constants/storageKeys';

const EMPTY_QUEUE: readonly AnalyticsEvent[] = [];

const queueSchema = z.array(analyticsEventSchema);

/**
 * Everything waiting to be sent.
 *
 * Stored data is treated as untrusted, the same way the pending brews are: a
 * queue that will not parse is thrown away rather than crashing a screen. The
 * cost of that is a hole in a funnel; the cost of the alternative is the app.
 */
export const readAnalyticsQueue = async (): Promise<readonly AnalyticsEvent[]> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.pendingAnalytics);

  if (stored === null) {
    return EMPTY_QUEUE;
  }

  try {
    const parsed = queueSchema.safeParse(JSON.parse(stored));

    return parsed.success ? parsed.data : EMPTY_QUEUE;
  } catch {
    return EMPTY_QUEUE;
  }
};

const writeQueue = async (queue: readonly AnalyticsEvent[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.pendingAnalytics, JSON.stringify(queue));
};

/**
 * Keeps one event, dropping the oldest once the queue is full.
 *
 * The oldest rather than the newest, because a phone that has been offline for
 * a fortnight is exactly the case this ceiling exists for, and what somebody
 * did this morning is what anybody would want to know about it.
 */
export const enqueueAnalyticsEvent = async (event: AnalyticsEvent): Promise<void> => {
  const queue = [...(await readAnalyticsQueue()), event];

  await writeQueue(queue.slice(Math.max(queue.length - ANALYTICS_QUEUE_MAX, 0)));
};

/**
 * Hands back everything waiting and empties the queue in one step.
 *
 * Taken rather than read, so a flush that fails can put back exactly what is
 * left instead of guessing which entries went through.
 */
export const takeAnalyticsQueue = async (): Promise<readonly AnalyticsEvent[]> => {
  const queue = await readAnalyticsQueue();

  await AsyncStorage.removeItem(STORAGE_KEYS.pendingAnalytics);

  return queue;
};

/** Puts back what a failed flush could not send, oldest first. */
export const restoreAnalyticsQueue = async (events: readonly AnalyticsEvent[]): Promise<void> => {
  await writeQueue([...events, ...(await readAnalyticsQueue())]);
};
