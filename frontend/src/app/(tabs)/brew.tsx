import type { JSX } from 'react';

import { PreBrewScreen } from '../../features/brewing';

/**
 * The brewing tab is the screen before a recipe.
 *
 * Not a menu leading to it: deciding what is being brewed, in what, and with
 * what missing today *is* brewing, and putting a list in front of it would add
 * a tap to the thing people open the app for.
 */
export default function BrewTab(): JSX.Element {
  return <PreBrewScreen />;
}
