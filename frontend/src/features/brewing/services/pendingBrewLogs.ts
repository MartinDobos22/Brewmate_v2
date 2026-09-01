import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBrewLogRequestSchema, type CreateBrewLogRequest } from '@brewmate/shared';
import { z } from 'zod';

import { STORAGE_KEYS } from '../../../constants/storageKeys';

const EMPTY_QUEUE: readonly CreateBrewLogRequest[] = [];
const FIRST_UNSENT = 1;

const queueSchema = z.array(createBrewLogRequestSchema);

/**
 * The brews that happened but have not reached the API yet.
 *
 * Brew mode has to work in a cabin kitchen with one bar of signal, so a cup
 * that was made is written to disk first and sent afterwards. Everything here
 * treats stored data as untrusted: a queue that will not parse is thrown away
 * rather than crashing the screen somebody is standing over, because the cost
 * of losing one entry is a brew log and the cost of the alternative is the
 * whole feature.
 */
export const readPendingBrewLogs = async (): Promise<readonly CreateBrewLogRequest[]> => {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.pendingBrewLogs);

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

const writeQueue = async (queue: readonly CreateBrewLogRequest[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.pendingBrewLogs, JSON.stringify(queue));
};

/** Keeps a brew that could not be sent, in the order it was made. */
export const enqueuePendingBrewLog = async (log: CreateBrewLogRequest): Promise<void> => {
  await writeQueue([...(await readPendingBrewLogs()), log]);
};

/**
 * Drops the brew at the head of the queue, once and only once the API has
 * accounted for it.
 *
 * This is the whole crash-safety of the queue, and it used to be the opposite.
 * A flush began by taking the queue and deleting the stored copy, then sent
 * the entries one by one and wrote back whatever had failed at the end - so
 * between those two moments every unsent brew existed only in memory. The app
 * being killed in that window is not a hypothetical: the window is a sequence
 * of network calls, and the flush runs when somebody opens the app after a
 * weekend away and then locks the phone. Every brew still in flight went with
 * it, from the one mechanism written to lose nothing.
 *
 * Re-reading before writing is what keeps a brew finished during the flush -
 * appended at the tail while the head is being sent - from being dropped along
 * with the entry that was.
 *
 * @returns what is left waiting, so the caller does not have to read it again.
 */
export const dropFirstPendingBrewLog = async (): Promise<readonly CreateBrewLogRequest[]> => {
  const remaining = (await readPendingBrewLogs()).slice(FIRST_UNSENT);

  await writeQueue(remaining);

  return remaining;
};
