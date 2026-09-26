import { useSegments } from 'expo-router';

import { OWN_BACK_SEGMENTS } from '../../../constants';

const FIRST_SEGMENT = 0;

/**
 * Whether this route takes the shared way back or draws its own.
 *
 * Read off the route for the reason the bottom bar is: "every screen except
 * these" is a rule about the application, and the first segment decides for
 * everything under it.
 */
export const useDrawsSharedBack = (): boolean =>
  !OWN_BACK_SEGMENTS.includes(useSegments()[FIRST_SEGMENT]);
