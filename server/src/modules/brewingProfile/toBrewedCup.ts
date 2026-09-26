import {
  readGrindCoffeeFacts,
  readGrindHabitShift,
  resolveRatio,
  type BrewedCup,
  type Grinder,
} from '@brewmate/shared';

import type { BrewedCupRow } from './brewingProfileRepository.js';

/**
 * The ratio that was actually in the cup.
 *
 * A shot logged by the dial-in records its dose and its yield and no ratio,
 * because the yield is the measurement and the ratio is arithmetic over it -
 * so where both weights were logged the ratio is worked out from them rather
 * than read off a recipe the shot deliberately missed.
 */
const readRatio = (row: BrewedCupRow): number => {
  const { doseGrams, waterGrams, ratio } = row.actualParams;

  if (ratio !== undefined) {
    return ratio;
  }

  return doseGrams === undefined || waterGrams === undefined
    ? row.recipeParams.ratio
    : resolveRatio(doseGrams, waterGrams);
};

/** The one grinder the recipe was ground on, where the catalogue knows it. */
const readGrinder = (row: BrewedCupRow, grinders: ReadonlyMap<string, Grinder>): Grinder | null =>
  row.equipmentIds
    .map((id: string): Grinder | undefined => grinders.get(id))
    .find((grinder): grinder is Grinder => grinder !== undefined) ?? null;

/**
 * One brew log, reduced to what the brewing profile reads.
 *
 * Each figure is what the log recorded where it recorded one and what the
 * recipe said where it did not - brew mode records the recipe as followed, so
 * for most cups the two are the same, and a shot that came out at 38 g rather
 * than 36 is the log's to say.
 *
 * The grind is measured here rather than in the fold, because measuring it
 * needs the grinder's catalogue entry and the coffee as it was on the morning
 * of the cup, and the fold is arithmetic over plain numbers.
 */
export const toBrewedCup = (
  row: BrewedCupRow,
  grinders: ReadonlyMap<string, Grinder>,
  supersededRecipeIds: ReadonlySet<string>,
): BrewedCup => {
  const grindSetting = row.actualParams.grindSetting ?? row.recipeParams.grindSetting;
  const coffee = readGrindCoffeeFacts(
    row.bagId === null
      ? null
      : { roastLevel: row.roastLevel, process: row.process, roastDate: row.roastDate },
    row.createdAt,
  );

  return {
    methodId: row.methodId,
    methodCategory: row.methodCategory,
    coffeeKey: row.bagId ?? row.recipeId,
    learningWeight: row.learningWeight,
    isSuperseded: supersededRecipeIds.has(row.recipeId),
    constraints: row.constraints,
    doseGrams: row.actualParams.doseGrams ?? row.recipeParams.doseGrams,
    ratio: readRatio(row),
    waterTempC: row.actualParams.waterTempC ?? row.recipeParams.waterTempC,
    grindShift:
      grindSetting === null
        ? null
        : readGrindHabitShift({
            methodCategory: row.methodCategory,
            coffee,
            grinder: readGrinder(row, grinders),
            grindSetting,
          }),
  };
};
