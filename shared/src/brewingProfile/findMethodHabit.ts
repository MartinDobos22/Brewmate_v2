import type { BrewingProfile } from './brewingProfileSchema.js';
import type { MethodHabit } from './methodHabitSchema.js';

/** The habit for one method, or null for a method never brewed. */
export const findMethodHabit = (
  profile: BrewingProfile | null | undefined,
  methodId: string | undefined,
): MethodHabit | null =>
  profile?.methods.find((habit: MethodHabit): boolean => habit.methodId === methodId) ?? null;
