import { createContext } from 'react';

import type { BackAction } from './backAction';

/**
 * The way back out of the screen being drawn, resolved once by the screen.
 *
 * Three values, and the third is the reason this is a context rather than a
 * prop: `null` means there is nowhere to go back to - the home tab, a signed-out
 * root - and `undefined` means no screen resolved it at all, so whatever wants
 * to draw the button has to ask the navigator itself.
 */
export const ScreenBackContext = createContext<BackAction | null | undefined>(undefined);
