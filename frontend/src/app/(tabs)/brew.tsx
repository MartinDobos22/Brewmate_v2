import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { PreBrewScreen } from '../../features/brewing';

/**
 * The brewing tab is the screen before a recipe.
 *
 * Not a menu leading to it: deciding what is being brewed, in what, and with
 * what missing today *is* brewing, and putting a list in front of it would add
 * a tap to the thing people open the app for.
 *
 * A coffee opened from its own screen arrives in the path, so "uvariť z nej"
 * lands here with the first question already answered rather than asking
 * somebody to find the bag they were just looking at.
 */
export default function BrewTab(): JSX.Element {
  const { bagId } = useLocalSearchParams<{ bagId?: string }>();

  return <PreBrewScreen initialBagId={bagId} />;
}
