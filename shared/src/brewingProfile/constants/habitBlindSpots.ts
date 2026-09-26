import type { BrewConstraintName } from '../../brewing/brewConstraintsSchema.js';

/**
 * Which missing piece of gear makes a cup say nothing about which figure.
 *
 * Narrower than the learning weight on purpose. A cup brewed without a
 * thermometer still weighed its coffee, so its dose is as good as any other
 * cup's; only its temperature is a guess, and only its temperature is left
 * out. Discounting the whole cup would throw away the part it measured, and
 * keeping the whole cup would teach the profile a temperature somebody never
 * chose.
 *
 * The grind loses a cup to three things: nothing to grind with, a collar that
 * cannot be moved, and somebody else's grinder - in all three the number on
 * the recipe was never where their own collar sat.
 */
export const HABIT_BLIND_SPOTS = {
  doseGrams: ['noScale'],
  ratio: ['noScale'],
  waterTempC: ['noTemperatureControl'],
  grind: ['noGrinder', 'fixedGrindSetting', 'borrowedEquipment'],
} as const satisfies Record<string, readonly BrewConstraintName[]>;

export type HabitFigure = keyof typeof HABIT_BLIND_SPOTS;
