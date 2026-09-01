import {
  matchCoffeeToProfile,
  type CoffeeMatch,
  type CoffeeTasteEstimate,
  type DrinkerTaste,
  type TasteProfile,
} from '@brewmate/shared';

import { useTasteProfile } from '../../tasteProfile/hooks';

/** The profile, narrowed to what a comparison actually reads off it. */
const toDrinker = (profile: TasteProfile): DrinkerTaste => ({
  acidity: profile.acidity,
  sweetness: profile.sweetness,
  body: profile.body,
  bitterness: profile.bitterness,
  intensity: profile.intensity,
  axisConfidence: profile.axisConfidence,
  milkUsage: profile.milkUsage,
});

/**
 * This coffee, held up against the person reading the screen.
 *
 * Computed on the phone from two things it already has - the profile it
 * fetched once and the estimate it folded itself - so the comparison is on
 * screen with the shape rather than after a round trip, and it keeps working
 * with no signal and no allowance. Nothing here asks a model anything: the
 * model's contribution to this comparison is the two sentences of prose in the
 * verdict, and the comparison itself is arithmetic either way.
 */
export const useCoffeeMatch = (estimate: CoffeeTasteEstimate): CoffeeMatch | null => {
  const profile = useTasteProfile();

  return profile.data === undefined
    ? null
    : matchCoffeeToProfile(estimate, toDrinker(profile.data));
};
