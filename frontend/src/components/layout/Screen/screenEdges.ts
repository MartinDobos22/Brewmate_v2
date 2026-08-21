import type { Edge } from 'react-native-safe-area-context';

/**
 * The bottom inset belongs to the tab bar, so a tab screen never claims it.
 * A screen pushed on top of the tabs does.
 */
export const TAB_SCREEN_EDGES: readonly Edge[] = ['top', 'left', 'right'];
export const STACK_SCREEN_EDGES: readonly Edge[] = ['top', 'left', 'right', 'bottom'];
