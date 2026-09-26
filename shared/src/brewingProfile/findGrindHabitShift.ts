import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';

import type { BrewingProfile } from './brewingProfileSchema.js';
import type { GrindHabit } from './grindHabitSchema.js';

/**
 * The grind habit for one grinder in one family, as the shift the guidance
 * takes.
 *
 * Null for a grinder nobody has enough cups on, which the guidance reads as no
 * habit at all - the same answer it gives somebody on their first morning. A
 * grinder never borrows another one's habit: the half of a habit that belongs
 * to the collar would be wrong on the other collar, and there is no telling
 * the two halves apart.
 * One function on both sides of the wire, so the band the app draws and the
 * band the recipe is written from move by the same amount.
 */
export const findGrindHabitShift = (
  profile: BrewingProfile | null | undefined,
  category: BrewMethodCategory | undefined,
  grinderEquipmentId: string | null | undefined,
): number | null =>
  profile?.grind.find(
    (habit: GrindHabit): boolean =>
      habit.methodCategory === category && habit.grinderEquipmentId === grinderEquipmentId,
  )?.shift ?? null;
