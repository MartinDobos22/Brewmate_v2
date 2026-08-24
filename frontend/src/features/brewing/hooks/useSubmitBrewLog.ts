import { useState } from 'react';
import type { BrewLog, CreateBrewLogRequest } from '@brewmate/shared';

import { useCreateBrewLog } from './useCreateBrewLog';
import { enqueuePendingBrewLog } from '../services/pendingBrewLogs';

export interface BrewLogSubmission {
  /** The stored log, once one exists. Null while it is only on the phone. */
  readonly brewLog: BrewLog | null;
  readonly isQueued: boolean;
  readonly isPending: boolean;
  readonly submit: (input: CreateBrewLogRequest) => void;
}

/**
 * Records a brew, and refuses to lose one.
 *
 * A cup that was made is a fact, and the place brew mode is most used - a
 * cabin kitchen, a holiday flat, a friend's house - is the place with the
 * least signal. So a request that fails is not an error to show somebody
 * standing over a finished coffee: the brew goes to disk and is sent the next
 * time the app has a connection.
 *
 * The queued case is reported rather than hidden, because it changes what
 * happens next: without a stored log there is no id for the conversation to
 * hang off, and the screen offers the chat only once there is one.
 */
export const useSubmitBrewLog = (): BrewLogSubmission => {
  const create = useCreateBrewLog();
  const [brewLog, setBrewLog] = useState<BrewLog | null>(null);
  const [isQueued, setIsQueued] = useState(false);

  return {
    brewLog,
    isQueued,
    isPending: create.isPending,

    submit: (input: CreateBrewLogRequest): void => {
      create.mutate(input, {
        onSuccess: (created: BrewLog): void => {
          setBrewLog(created);
        },
        onError: (): void => {
          setIsQueued(true);
          void enqueuePendingBrewLog(input);
        },
      });
    },
  };
};
