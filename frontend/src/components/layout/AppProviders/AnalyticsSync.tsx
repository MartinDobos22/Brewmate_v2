import type { JSX, ReactNode } from 'react';

import { useAnalyticsFlush } from '../../../hooks';

export interface AnalyticsSyncProps {
  readonly children: ReactNode;
}

/**
 * Sends the flow events that were recorded while the phone had no signal.
 *
 * Mounted at the root, next to the brew log sync and for the same reason: the
 * moment the queue can be emptied is the moment the connection comes back, and
 * that has nothing to do with which screen is open. The two are separate
 * components rather than one because they fail differently - a lost brew is a
 * lost cup, a lost event is a gap in a funnel - and the code that treats them
 * the same would eventually treat them equally badly.
 *
 * It renders nothing of its own: a component only because that is where a hook
 * can live.
 */
export const AnalyticsSync = ({ children }: AnalyticsSyncProps): JSX.Element => {
  useAnalyticsFlush();

  return <>{children}</>;
};
