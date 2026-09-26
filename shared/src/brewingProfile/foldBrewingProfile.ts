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
import { readCupTarget } from './readCupTarget.js';
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
const groupBy = <Cup extends BrewedCup, Key>(
  cups: readonly Cup[],
  keyOf: (cup: Cup) => Key,
): ReadonlyMap<Key, readonly Cup[]> => {
  const groups = new Map<Key, Cup[]>();

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

/** Every cup that can speak about this figure, with where it should have been and what it is worth. */
const readFigure = (
  cups: readonly BrewedCup[],
  figure: HabitFigure,
): readonly (WeightedValue & { readonly cup: BrewedCup })[] =>
  cups.flatMap((cup: BrewedCup) => {
    const value = readCupTarget(cup, figure);

    return value === null || isBlindTo(cup, figure)
      ? []
      : [{ value, weight: readCupWeight(cup, figure), cup }];
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
  step: number,
): number | null => {
  const values = readFigure(cups, figure);
  const median = values.length < BREWING_HABIT_MIN_CUPS ? null : weightedMedian(values);

  return median === null ? null : toStep(median, step);
};

const readMethodHabit = (methodId: string, cups: readonly BrewedCup[]): MethodHabit => ({
  methodId,
  cupCount: cups.length,
  doseGrams: readHabit(cups, 'doseGrams', HABIT_DOSE_STEP),
  ratio: readHabit(cups, 'ratio', HABIT_RATIO_STEP),
  waterTempC: readHabit(cups, 'waterTempC', HABIT_TEMPERATURE_STEP),
});

/**
 * The grind habit, measured against the bag each cup was ground from.
 *
 * A habit under the noticeable threshold is reported as zero rather than as a
 * fraction nobody could taste - which is still a habit, and a different answer
 * from not knowing.
 */
const readGrindHabit = (
  grinderEquipmentId: string,
  category: BrewMethodCategory,
  cups: readonly BrewedCup[],
): GrindHabit => {
  const values = readFigure(cups, 'grind');
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
    grinderEquipmentId,
    methodCategory: category,
    cupCount: values.length,
    coffeeCount,
    shift: shift === null || Math.abs(shift) >= GRIND_HABIT_NOTICEABLE ? shift : NO_HABIT,
  };
};

type GroundCup = BrewedCup & { readonly grinderId: string };

const isGround = (cup: BrewedCup): cup is GroundCup => cup.grinderId !== null;

/** One habit per grinder per family - a hand grinder and an electric one are two collars. */
const readGrindHabits = (cups: readonly BrewedCup[]): readonly GrindHabit[] =>
  [...groupBy(cups.filter(isGround), (cup): string => cup.grinderId)].flatMap(
    ([grinderId, onGrinder]): readonly GrindHabit[] =>
      [...groupBy(onGrinder, (cup): BrewMethodCategory => cup.methodCategory)].map(
        ([category, group]): GrindHabit => readGrindHabit(grinderId, category, group),
      ),
  );

/**
 * How somebody brews, folded out of the cups they brewed.
 *
 * Everything is watched, and one thing is listened to. The dose and the ratio
 * are what they actually weighed and poured, the temperature is what their
 * kettle was set to, and the grind is where their collar sat measured against
 * where the bag alone would have put it. What they said about a cup afterwards
 * then moves that cup's numbers to where they wanted them - "bola kyslá" is a
 * grind that should have been finer - and "presne takto" makes the cup count
 * double. The more cups, the better the answer.
 *
 * Deterministic and free, like every other piece of arithmetic this product
 * makes claims with. The caller decides which cups are recent enough to count;
 * this decides what they add up to.
 */
export const foldBrewingProfile = (cups: readonly BrewedCup[]): BrewingProfile => ({
  methods: [...groupBy(cups, (cup): string => cup.methodId)].map(([methodId, group]): MethodHabit =>
    readMethodHabit(methodId, group),
  ),
  grind: [...readGrindHabits(cups)],
});
