import type { JSX, ReactNode } from 'react';

import { usePendingBrewLogs } from '../../../features/brewing/hooks';

export interface PendingBrewLogSyncProps {
  readonly children: ReactNode;
}

/**
 * Sends the brews that were made while the phone had no signal.
 *
 * Mounted at the root rather than on the brewing screens, because the moment
 * the queue can be emptied is the moment the connection comes back, and that
 * has nothing to do with which screen somebody is looking at. Whoever brewed
 * at a cabin on Saturday opens the app on the bus on Monday and their cups are
 * already in the history by the time they get to the cupboard.
 *
 * It renders nothing of its own: a component only because that is where a hook
 * can live.
 */
export const PendingBrewLogSync = ({ children }: PendingBrewLogSyncProps): JSX.Element => {
  usePendingBrewLogs();

  return <>{children}</>;
};
