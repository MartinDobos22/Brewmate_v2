import { useContext } from 'react';

import type { BackAction } from './backAction';
import { ScreenBackContext } from './ScreenBackContext';
import { useBackAction } from './useBackAction';

/**
 * The way back, for whatever draws the button inside a screen.
 *
 * The screen's own answer wherever there is one, because only the screen
 * knows whether it has a stage to go back to. A block drawn outside any
 * screen that resolved it - a screen composing its own layout - asks the
 * navigator instead, so it still has a way out rather than none.
 */
export const useScreenBack = (): BackAction | null => {
  const resolved = useContext(ScreenBackContext);
  const own = useBackAction();

  return resolved === undefined ? own : resolved;
};
