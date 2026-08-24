import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBrewLogRequestSchema, type CreateBrewLogRequest } from '@brewmate/shared';
import { z } from 'zod';

import { STORAGE_KEYS } from '../../../constants/storageKeys';

const EMPTY_QUEUE: readonly CreateBrewLogRequest[] = [];

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
 * Hands back everything waiting and empties the queue in one step.
 *
 * Taken rather than read, so a flush that fails halfway can put back exactly
 * what is left instead of guessing which entries went through.
 */
export const takePendingBrewLogs = async (): Promise<readonly CreateBrewLogRequest[]> => {
  const queue = await readPendingBrewLogs();

  await AsyncStorage.removeItem(STORAGE_KEYS.pendingBrewLogs);

  return queue;
};

/** Puts back what a failed flush could not send. */
export const restorePendingBrewLogs = async (
  logs: readonly CreateBrewLogRequest[],
): Promise<void> => {
  await writeQueue([...logs, ...(await readPendingBrewLogs())]);
};
