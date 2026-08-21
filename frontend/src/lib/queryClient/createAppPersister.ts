import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { Persister } from '@tanstack/react-query-persist-client';

import { LIMITS } from '../../constants/limits';
import { STORAGE_KEYS } from '../../constants/storageKeys';

/** Writes the query cache to AsyncStorage so a cold start is not a blank app. */
export const createAppPersister = (): Persister =>
  createAsyncStoragePersister({
    storage: AsyncStorage,
    key: STORAGE_KEYS.queryCache,
    throttleTime: LIMITS.persistThrottleMs,
  });
