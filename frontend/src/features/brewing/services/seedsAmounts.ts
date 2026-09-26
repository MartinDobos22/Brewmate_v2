import type { MethodHabit } from '@brewmate/shared';

/**
 * Whether this person's own cups decided the dose or the ratio on the card.
 *
 * Either figure is enough: a habit with a dose and no ratio still seeded the
 * dose, and the line under the card has to own up to that rather than credit
 * the method's middle with a number it did not choose.
 */
export const seedsAmounts = (habit: MethodHabit | null): boolean =>
  habit !== null && (habit.doseGrams !== null || habit.ratio !== null);
