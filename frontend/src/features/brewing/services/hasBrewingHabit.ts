import type { MethodHabit } from '@brewmate/shared';

/**
 * Whether any number in a reference cup came from this person's own cups.
 *
 * The temperature counts as well as the amounts here, because a quick brew
 * proposes all three - and a rationale that credits the method's middle with a
 * temperature somebody settled on themselves is the recipe misdescribing
 * itself.
 */
export const hasBrewingHabit = (habit: MethodHabit | null): boolean =>
  habit !== null && (habit.doseGrams !== null || habit.ratio !== null || habit.waterTempC !== null);
