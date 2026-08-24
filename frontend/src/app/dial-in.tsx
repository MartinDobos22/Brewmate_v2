import type { JSX } from 'react';

import { DialInScreen } from '../features/espresso';

/**
 * Dialling in one coffee on an espresso machine.
 *
 * Which recipe is read inside the screen from the route, so a deep link back
 * into a half-finished dial-in works the same as arriving from the brew screen.
 */
export default function DialInRoute(): JSX.Element {
  return <DialInScreen />;
}
