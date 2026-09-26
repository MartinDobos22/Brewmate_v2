import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';

import type { BrewingProfile } from './brewingProfileSchema.js';
import type { GrindHabit } from './grindHabitSchema.js';

/**
 * The grind habit for one family, as the shift the guidance takes.
 *
 * Null for a family nobody has enough cups in, which the guidance reads as no
 * habit at all - the same answer it gives somebody on their first morning.
 * One function on both sides of the wire, so the band the app draws and the
 * band the recipe is written from move by the same amount.
 */
export const findGrindHabitShift = (
  profile: BrewingProfile | null | undefined,
  category: BrewMethodCategory | undefined,
): number | null =>
  profile?.grind.find((habit: GrindHabit): boolean => habit.methodCategory === category)?.shift ??
  null;
