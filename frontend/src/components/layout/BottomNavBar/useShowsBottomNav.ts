import { useSegments } from 'expo-router';

import { BOTTOM_BAR_HIDDEN_SEGMENTS } from '../../../constants';

const FIRST_SEGMENT = 0;

/**
 * Whether this screen draws the shared bottom bar.
 *
 * Decided from the route rather than passed down as a prop, because "every
 * screen except these" is a rule about the application and not a decision each
 * screen should be able to make differently. A prop would be forgotten on the
 * next screen somebody adds, and forgotten is the state this whole change
 * exists to fix.
 *
 * The first segment is enough: a group decides for everything inside it, and
 * a route's own name decides for its children - so a coffee's own screen at
 * `/coffee-bags/<id>` is answered by `coffee-bags` without anybody listing it.
 */
export const useShowsBottomNav = (): boolean =>
  !BOTTOM_BAR_HIDDEN_SEGMENTS.includes(useSegments()[FIRST_SEGMENT]);
