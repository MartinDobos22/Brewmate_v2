import type { BrewStep } from '../brewing/brewStepSchema.js';
import type { Grinder } from '../grinders/grinderSchema.js';

import { convertAmounts } from './convertAmounts.js';
import { convertGrind } from './convertGrind.js';
import { convertSchedule } from './convertSchedule.js';
import { convertTemperature } from './convertTemperature.js';
import type { ConversionNote } from './conversionNoteSchema.js';
import type { ConversionTarget } from './conversionTarget.js';
import type { GrindDescriptor } from './grindDescriptors.js';
import type { SourceRecipe } from './sourceRecipeSchema.js';

/**
 * Somebody else's recipe, on this person's equipment.
 *
 * Deliberately not a `BrewParams`: this is the arithmetic's answer, not a
 * recipe. It carries no water type, no grind label in anybody's language and
 * no rationale, because none of those are things a calculation knows. Whoever
 * calls this turns the answer into a recipe, and the seam between the two is
 * exactly where a better conversion algorithm gets swapped in later.
 */
export interface ConversionResult {
  readonly doseGrams: number;
  readonly waterGrams: number;
  readonly ratio: number;
  /** A number on their own collar, or null where their grinder has no curve. */
  readonly grindSetting: number | null;
  /** The particle size both grinders were compared through. */
  readonly grindMicrons: number | null;
  readonly grindDescriptor: GrindDescriptor | null;
  readonly waterTempC: number | null;
  readonly totalTimeSeconds: number | null;
  readonly preInfusionSeconds: number | null;
  readonly steps: readonly BrewStep[];
  /**
   * Whether the pour schedule is a hole rather than an answer.
   *
   * True when the source had no schedule, or had one written for a different
   * family of brewer. Everything else in this result is arithmetic; this is
   * the one place the conversion admits it has nothing and something else has
   * to fill it in.
   */
  readonly scheduleMayBeRewritten: boolean;
  readonly notes: readonly ConversionNote[];
}

/**
 * The whole conversion, in code, with no model anywhere near it.
 *
 * Four independent calculations - the grind through microns, the amounts
 * through the brewer's capacity, the temperature through whether one can be
 * set at all, and the pour schedule through the water it pours - each of which
 * reports what it did and how much that is worth. Nothing here consults
 * anything about the person: their taste has no bearing on what somebody
 * else's 22 clicks means on their own grinder.
 *
 * Kept isolated on purpose, with its own tests, so that the day a real
 * particle-size model replaces this arithmetic, the replacement is one folder
 * and one set of tests rather than an archaeology exercise across the app.
 */
export const convertRecipe = (
  recipe: SourceRecipe,
  sourceGrinder: Grinder | null,
  target: ConversionTarget,
): ConversionResult => {
  const amounts = convertAmounts(recipe, target);
  const grind = convertGrind(recipe, sourceGrinder, target);
  const temperature = convertTemperature(recipe, target);
  const schedule = convertSchedule(recipe, target, amounts.waterGrams);

  return {
    doseGrams: amounts.doseGrams,
    waterGrams: amounts.waterGrams,
    ratio: amounts.ratio,
    grindSetting: grind.setting,
    grindMicrons: grind.microns,
    grindDescriptor: grind.descriptor,
    waterTempC: temperature.waterTempC,
    totalTimeSeconds: schedule.totalTimeSeconds,
    preInfusionSeconds: schedule.preInfusionSeconds,
    steps: schedule.steps,
    scheduleMayBeRewritten: schedule.mayBeRewritten,
    notes: [...amounts.notes, ...grind.notes, ...temperature.notes, ...schedule.notes],
  };
};
