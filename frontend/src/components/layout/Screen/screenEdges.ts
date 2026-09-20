import type { Edge } from 'react-native-safe-area-context';

const BOTTOM_EDGE: Edge = 'bottom';

/**
 * The bottom inset belongs to the tab bar, so a tab screen never claims it.
 * A screen pushed on top of the tabs does.
 */
export const TAB_SCREEN_EDGES: readonly Edge[] = ['top', 'left', 'right'];
export const STACK_SCREEN_EDGES: readonly Edge[] = ['top', 'left', 'right', 'bottom'];

/**
 * A screen whose own content reaches the glass at both ends.
 *
 * The espresso block starts under the notch and takes that inset as its own
 * padding, and whatever is pinned to the bottom - a foot bar, a composer, the
 * shared navigation bar - takes the other. A screen that also claimed either
 * would leave a strip of its background above a header meant to start at the
 * top edge, or under a bar meant to sit on the bottom one.
 */
export const HEADER_SCREEN_EDGES: readonly Edge[] = ['left', 'right'];

/**
 * The same set with the bottom given away.
 *
 * Used where the screen hangs the shared navigation bar inside itself: the
 * gesture bar's height belongs to whatever is actually against the bottom
 * edge, which is then the bar rather than the screen.
 */
export const withoutBottomEdge = (edges: readonly Edge[]): readonly Edge[] =>
  edges.filter((edge: Edge): boolean => edge !== BOTTOM_EDGE);
