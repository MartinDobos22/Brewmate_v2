import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CreateBrewLogRequest } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useIsOnline } from '../../../hooks';
import { createBrewLog } from '../services/brewLogsApi';
import { isPermanentlyRejectedBrewLog } from '../services/isPermanentlyRejectedBrewLog';
import { dropFirstPendingBrewLog, readPendingBrewLogs } from '../services/pendingBrewLogs';

const NOTHING = 0;
const FIRST = 0;

/**
 * Sends the brews that happened while the phone had no signal.
 *
 * Runs whenever the app comes back online rather than on a timer, because
 * coming back online is the only event that changes the answer.
 *
 * One brew at a time, from the head, and nothing leaves the disk until the API
 * has accounted for it. The flush used to empty the stored queue up front and
 * write the failures back at the end, which meant every brew it had not yet
 * delivered lived only in memory for the length of a sequence of network
 * calls - and being killed there is exactly what happens to an app that starts
 * flushing when somebody opens it on a bus and then locks the phone.
 *
 * It stops at the first brew it could not send rather than working through the
 * rest. What puts brews in this queue is a missing connection, and a missing
 * connection does not become present for the fourth entry having refused the
 * third; carrying on would be three more timeouts to reach the same answer.
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
      let queued: readonly CreateBrewLogRequest[] = await readPendingBrewLogs();

      setPending(queued.length);

      if (!isOnline) {
        return;
      }

      let delivered = NOTHING;

      while (queued.length > NOTHING) {
        const head = queued[FIRST];

        if (head === undefined) {
          return;
        }

        try {
          await createBrewLog(head);
          delivered += 1;
        } catch (error: unknown) {
          /*
           * A brew the server will never accept is dropped, because leaving it
           * at the head would block every cup queued behind it forever.
           * Anything else stays exactly where it is and is offered again the
           * next time the app has a connection.
           */
          if (!isPermanentlyRejectedBrewLog(error)) {
            return;
          }
        }

        queued = await dropFirstPendingBrewLog();
        setPending(queued.length);
      }

      if (delivered > NOTHING) {
        await queryClient.invalidateQueries({ queryKey: QUERY_ROOTS.brewLogs });
      }
    };

    void flush();
  }, [isOnline, queryClient]);

  return pending;
};
