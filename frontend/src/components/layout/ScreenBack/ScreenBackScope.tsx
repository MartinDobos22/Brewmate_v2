import type { JSX, ReactNode } from 'react';

import type { BackAction } from './backAction';
import { ScreenBackContext } from './ScreenBackContext';
import { useBackAction } from './useBackAction';
import { useDrawsSharedBack } from './useDrawsSharedBack';

export interface ScreenBackScopeProps {
  readonly children: ReactNode;
  /** A stage inside the screen to go back to before leaving it. */
  readonly onBack?: BackAction;
}

/**
 * Resolves the way back once, for everything drawn inside one screen.
 *
 * `Screen` wraps every screen in one. The two screens that compose their own
 * layout - the brewing form and the conversation after a cup - wrap
 * themselves, so the block at their top says the same thing about "späť" as
 * the rest of the app does.
 *
 * A route that draws its own way back resolves to none, so nothing inside it
 * draws a second one.
 */
export const ScreenBackScope = ({ children, onBack }: ScreenBackScopeProps): JSX.Element => {
  const back = useBackAction(onBack);
  const drawsSharedBack = useDrawsSharedBack();

  return (
    <ScreenBackContext.Provider value={drawsSharedBack ? back : null}>
      {children}
    </ScreenBackContext.Provider>
  );
};
