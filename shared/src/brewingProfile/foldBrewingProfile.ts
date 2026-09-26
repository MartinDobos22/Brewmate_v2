import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';
import { HABIT_SHIFT_LIMIT } from '../grindGuidance/grindGuidanceFieldLimits.js';

import type { BrewedCup } from './brewedCup.js';
import {
  BREWING_HABIT_MIN_CUPS,
  GRIND_HABIT_MIN_COFFEES,
  GRIND_HABIT_NOTICEABLE,
  HABIT_DOSE_STEP,
  HABIT_RATIO_STEP,
  HABIT_SHIFT_DECIMALS,
  HABIT_TEMPERATURE_STEP,
} from './brewingProfileFieldLimits.js';
import type { BrewingProfile } from './brewingProfileSchema.js';
import type { HabitFigure } from './constants/habitBlindSpots.js';
import type { GrindHabit } from './grindHabitSchema.js';
import type { MethodHabit } from './methodHabitSchema.js';
import { isBlindTo, readCupWeight } from './readCupWeight.js';
import { weightedMedian, type WeightedValue } from './weightedMedian.js';

const NO_HABIT = 0;
const ROUNDING_BASE = 10;

const toStep = (value: number, step: number): number => Math.round(value / step) * step;

const toDecimals = (value: number, decimals: number): number => {
  const factor = ROUNDING_BASE ** decimals;

  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Cups in the order they arrived, grouped by whatever key the caller reads. */
const groupBy = <Key>(
  cups: readonly BrewedCup[],
  keyOf: (cup: BrewedCup) => Key,
): ReadonlyMap<Key, readonly BrewedCup[]> => {
  const groups = new Map<Key, BrewedCup[]>();

  for (const cup of cups) {
    const key = keyOf(cup);
    const group = groups.get(key);

    if (group === undefined) {
      groups.set(key, [cup]);
    } else {
      group.push(cup);
    }
  }

  return groups;
};

/** Every cup that can speak about this figure, with what it said and what it is worth. */
const readFigure = (
  cups: readonly BrewedCup[],
  figure: HabitFigure,
  valueOf: (cup: BrewedCup) => number | null,
): readonly (WeightedValue & { readonly cup: BrewedCup })[] =>
  cups.flatMap((cup: BrewedCup) => {
    const value = valueOf(cup);

    return value === null || isBlindTo(cup, figure)
      ? []
      : [{ value, weight: readCupWeight(cup), cup }];
  });

/**
 * One figure's habit, or null until enough cups stand behind it.
 *
 * Rounded to the step the form moves in, so the first press of a stepper
 * lands on a number rather than between two.
 */
const readHabit = (
  cups: readonly BrewedCup[],
  figure: HabitFigure,
  valueOf: (cup: BrewedCup) => number | null,
  step: number,
): number | null => {
  const values = readFigure(cups, figure, valueOf);
  const median = values.length < BREWING_HABIT_MIN_CUPS ? null : weightedMedian(values);

  return median === null ? null : toStep(median, step);
};

const readMethodHabit = (methodId: string, cups: readonly BrewedCup[]): MethodHabit => ({
  methodId,
  cupCount: cups.length,
  doseGrams: readHabit(cups, 'doseGrams', (cup): number | null => cup.doseGrams, HABIT_DOSE_STEP),
  ratio: readHabit(cups, 'ratio', (cup): number | null => cup.ratio, HABIT_RATIO_STEP),
  waterTempC: readHabit(
    cups,
    'waterTempC',
    (cup): number | null => cup.waterTempC,
    HABIT_TEMPERATURE_STEP,
  ),
});

/**
 * The grind habit, measured against the bag each cup was ground from.
 *
 * A habit under the noticeable threshold is reported as zero rather than as a
 * fraction nobody could taste - which is still a habit, and a different answer
 * from not knowing.
 */
const readGrindHabit = (category: BrewMethodCategory, cups: readonly BrewedCup[]): GrindHabit => {
  const values = readFigure(cups, 'grind', (cup): number | null => cup.grindShift);
  const coffeeCount = new Set(values.map((entry): string => entry.cup.coffeeKey)).size;
  const median =
    values.length < BREWING_HABIT_MIN_CUPS || coffeeCount < GRIND_HABIT_MIN_COFFEES
      ? null
      : weightedMedian(values);
  const shift =
    median === null
      ? null
      : toDecimals(clamp(median, -HABIT_SHIFT_LIMIT, HABIT_SHIFT_LIMIT), HABIT_SHIFT_DECIMALS);

  return {
    methodCategory: category,
    cupCount: values.length,
    coffeeCount,
    shift: shift === null || Math.abs(shift) >= GRIND_HABIT_NOTICEABLE ? shift : NO_HABIT,
  };
};

/**
 * How somebody brews, folded out of the cups they brewed.
 *
 * Nothing here is told; everything is watched. The dose and the ratio are what
 * they actually weighed and poured, the temperature is what their kettle was
 * set to, and the grind is where their collar sat measured against where the
 * bag alone would have put it. The more cups, the better the answer - which is
 * the whole promise of the thing, and the reason it asks nobody anything.
 *
 * Deterministic and free, like every other piece of arithmetic this product
 * makes claims with. The caller decides which cups are recent enough to count;
 * this decides what they add up to.
 */
export const foldBrewingProfile = (cups: readonly BrewedCup[]): BrewingProfile => ({
  methods: [...groupBy(cups, (cup): string => cup.methodId)].map(([methodId, group]): MethodHabit =>
    readMethodHabit(methodId, group),
  ),
  grind: [...groupBy(cups, (cup): BrewMethodCategory => cup.methodCategory)].map(
    ([category, group]): GrindHabit => readGrindHabit(category, group),
  ),
});
