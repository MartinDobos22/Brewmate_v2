import type { Edge } from 'react-native-safe-area-context';

/**
 * Every inset but the top.
 *
 * The espresso block starts at the glass and takes the notch for itself, so a
 * screen that also claimed it would leave a strip of background above a header
 * meant to reach the top edge.
 */
export const PRE_BREW_SCREEN_EDGES: readonly Edge[] = ['left', 'right', 'bottom'];
