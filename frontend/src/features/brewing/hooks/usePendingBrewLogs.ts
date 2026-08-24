import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CreateBrewLogRequest } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useIsOnline } from '../../../hooks';
import { createBrewLog } from '../services/brewLogsApi';
import {
  readPendingBrewLogs,
  restorePendingBrewLogs,
  takePendingBrewLogs,
} from '../services/pendingBrewLogs';

const NOTHING = 0;

/**
 * Sends the brews that happened while the phone had no signal.
 *
 * Runs whenever the app comes back online rather than on a timer, because
 * coming back online is the only event that changes the answer. Everything
 * that cannot be sent goes straight back into the queue in the order it was
 * made: a flush that dropped what it could not deliver would lose exactly the
 * brews this whole mechanism exists for.
 *
 * @returns how many brews are still waiting, so a screen can say so rather
 * than pretending the cupboard is up to date.
 */
export const usePendingBrewLogs = (): number => {
  const isOnline = useIsOnline();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(NOTHING);

  useEffect((): void => {
    const flush = async (): Promise<void> => {
      const queued = await readPendingBrewLogs();

      setPending(queued.length);

      if (!isOnline || queued.length === NOTHING) {
        return;
      }

      const taken = await takePendingBrewLogs();
      const failed: CreateBrewLogRequest[] = [];

      for (const log of taken) {
        try {
          await createBrewLog(log);
        } catch {
          failed.push(log);
        }
      }

      await restorePendingBrewLogs(failed);
      setPending(failed.length);

      if (failed.length < taken.length) {
        await queryClient.invalidateQueries({ queryKey: QUERY_ROOTS.brewLogs });
      }
    };

    void flush();
  }, [isOnline, queryClient]);

  return pending;
};
