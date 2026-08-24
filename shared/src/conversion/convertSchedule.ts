import { BREW_METHOD_CATEGORIES } from '../enums/brewMethodCategories.js';
import { GRAMS_DECIMALS } from '../brewing/ratioCalculator.js';
import type { BrewStep } from '../brewing/brewStepSchema.js';

import { SCALE_FACTOR_TOLERANCE, SCALE_FACTOR_UNCHANGED } from './conversionFieldLimits.js';
import type { ConversionNote } from './conversionNoteSchema.js';
import { CONVERSION_PRECISIONS } from './conversionPrecision.js';
import { CONVERSION_REASONS } from './conversionReasons.js';
import type { ConversionTarget } from './conversionTarget.js';
import type { SourceRecipe } from './sourceRecipeSchema.js';

const SCHEDULE = 'schedule';
const TIME = 'time';
const NOTHING = 0;
const ROUNDING_BASE = 10;

const roundGrams = (value: number): number => {
  const factor = ROUNDING_BASE ** GRAMS_DECIMALS;

  return Math.round(value * factor) / factor;
};

/**
 * The pour schedule and the clock, converted together.
 *
 * `mayBeRewritten` is what the caller does with the empty case: a schedule
 * that could not be carried over is a hole a model is allowed to fill, and one
 * that came over intact is not. That distinction is enforced in the answer
 * schema rather than asked for politely, which is the same trick the recipe
 * engine uses to keep a dose from being overwritten.
 */
export interface ConvertedSchedule {
  readonly steps: readonly BrewStep[];
  readonly totalTimeSeconds: number | null;
  readonly preInfusionSeconds: number | null;
  readonly mayBeRewritten: boolean;
  readonly notes: readonly ConversionNote[];
}

const note = (
  field: ConversionNote['field'],
  precision: ConversionNote['precision'],
  reason: ConversionNote['reason'],
): ConversionNote => ({ field, precision, reason });

/** The water this schedule was written for, from the recipe or from its own last step. */
const scheduleWaterGrams = (recipe: SourceRecipe): number | null => {
  if (recipe.waterGrams !== null) {
    return recipe.waterGrams;
  }

  const poured = recipe.steps
    .map((step: BrewStep): number => step.waterGrams ?? NOTHING)
    .filter((grams: number): boolean => grams > NOTHING);

  return poured.length === NOTHING ? null : Math.max(...poured);
};

/**
 * The same pour, for a different amount of water.
 *
 * Every step's cumulative weight moves by one factor, so the shape of the pour
 * survives: a bloom that was a sixth of the water stays a sixth of the water.
 * The times do not move with it, and that is deliberate - a bloom lasts as
 * long as the coffee degasses, not as long as the brew is big.
 */
const scaleSteps = (steps: readonly BrewStep[], factor: number): readonly BrewStep[] =>
  steps.map((step: BrewStep): BrewStep => ({
    ...step,
    waterGrams: step.waterGrams === null ? null : roundGrams(step.waterGrams * factor),
  }));

/**
 * Somebody else's pour schedule, on this person's brewer.
 *
 * Where the two brewers are the same family, the schedule is real information
 * and is scaled with the water it pours. Where they are not, it is not
 * information at all: a V60's three pours mean nothing in an AeroPress, and
 * carrying them across would produce a recipe that looks precise and instructs
 * somebody to do something their brewer cannot do. In that case the schedule
 * is dropped and reported as dropped, and writing a new one is the one thing
 * the conversion asks a model for.
 */
export const convertSchedule = (
  recipe: SourceRecipe,
  target: ConversionTarget,
  targetWaterGrams: number,
): ConvertedSchedule => {
  const crossesFamily =
    recipe.methodCategory !== null && recipe.methodCategory !== target.methodCategory;
  const keepsEspresso =
    recipe.methodCategory === BREW_METHOD_CATEGORIES.espresso &&
    target.methodCategory === BREW_METHOD_CATEGORIES.espresso;

  if (crossesFamily) {
    return {
      steps: [],
      totalTimeSeconds: null,
      preInfusionSeconds: null,
      mayBeRewritten: true,
      notes: [
        note(SCHEDULE, CONVERSION_PRECISIONS.unknown, CONVERSION_REASONS.differentMethodCategory),
        note(TIME, CONVERSION_PRECISIONS.unknown, CONVERSION_REASONS.differentMethodCategory),
      ],
    };
  }

  const timeNote =
    recipe.totalTimeSeconds === null
      ? note(TIME, CONVERSION_PRECISIONS.unknown, CONVERSION_REASONS.notStatedInSource)
      : note(TIME, CONVERSION_PRECISIONS.exact, CONVERSION_REASONS.keptFromSource);
  const preInfusionSeconds = keepsEspresso ? recipe.preInfusionSeconds : null;

  if (recipe.steps.length === NOTHING) {
    return {
      steps: [],
      totalTimeSeconds: recipe.totalTimeSeconds,
      preInfusionSeconds,
      mayBeRewritten: true,
      notes: [
        note(SCHEDULE, CONVERSION_PRECISIONS.unknown, CONVERSION_REASONS.notStatedInSource),
        timeNote,
      ],
    };
  }

  const sourceWater = scheduleWaterGrams(recipe);
  const factor = sourceWater === null ? SCALE_FACTOR_UNCHANGED : targetWaterGrams / sourceWater;
  const unchanged = Math.abs(factor - SCALE_FACTOR_UNCHANGED) <= SCALE_FACTOR_TOLERANCE;

  return {
    steps: unchanged ? recipe.steps : scaleSteps(recipe.steps, factor),
    totalTimeSeconds: recipe.totalTimeSeconds,
    preInfusionSeconds,
    mayBeRewritten: false,
    notes: [
      unchanged
        ? note(SCHEDULE, CONVERSION_PRECISIONS.exact, CONVERSION_REASONS.keptFromSource)
        : note(SCHEDULE, CONVERSION_PRECISIONS.estimated, CONVERSION_REASONS.scaledWithWater),
      timeNote,
    ],
  };
};
