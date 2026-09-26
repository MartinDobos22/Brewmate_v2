import { describe, expect, it } from 'vitest';

import {
  BREW_METHOD_CATEGORIES,
  GRIND_SHIFT_SOURCES,
  HABIT_SHIFT_LIMIT,
  ROAST_LEVELS,
  UNKNOWN_COFFEE,
  readGrindHabitShift,
  resolveGrindGuidance,
  type BrewMethodCategory,
  type Grinder,
  type GrindCoffeeFacts,
  type GrindShift,
} from '../../src/index.js';
import { MEASURED_GRINDER, UNCALIBRATED_GRINDER } from '../conversion/testGrinders.js';
import { PUBLISHED_GRINDER } from '../grindGuidance/testGuidanceGrinders.js';

const FINER_HABIT = -0.45;
const COARSER_HABIT = 0.3;
const FAR_TOO_FINE = -3;
/** Half a click either way, as a fraction of each range's half-width. */
const WINDOW_SNAP_TOLERANCE = 0.1;
const PUBLISHED_SNAP_TOLERANCE = 0.15;
const ANY_SETTING = 20;

const DARK: GrindCoffeeFacts = { ...UNKNOWN_COFFEE, roastLevel: ROAST_LEVELS.dark };
const LIGHT: GrindCoffeeFacts = { ...UNKNOWN_COFFEE, roastLevel: ROAST_LEVELS.light };

interface Case {
  readonly grinder: Grinder;
  readonly methodCategory: BrewMethodCategory;
  readonly tolerance: number;
}

const WINDOW_CASE: Case = {
  grinder: MEASURED_GRINDER,
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  tolerance: WINDOW_SNAP_TOLERANCE,
};

const PUBLISHED_CASE: Case = {
  grinder: PUBLISHED_GRINDER,
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  tolerance: PUBLISHED_SNAP_TOLERANCE,
};

/** Where the guidance would start, for this coffee and this habit. */
const startFor = (
  { grinder, methodCategory }: Case,
  coffee: GrindCoffeeFacts,
  habitShift: number | null,
): number => {
  const setting = resolveGrindGuidance({ methodCategory, coffee, grinder, habitShift }).setting;

  if (setting === null) {
    throw new Error('the fixture grinder should always produce a setting');
  }

  return setting.target;
};

const readBack = (
  { grinder, methodCategory }: Case,
  coffee: GrindCoffeeFacts,
  grindSetting: number,
): number | null => readGrindHabitShift({ methodCategory, coffee, grinder, grindSetting });

const within = (value: number | null, expected: number, tolerance: number): boolean =>
  value !== null && Math.abs(value - expected) <= tolerance;

describe('reading a habit off a setting somebody actually brewed at', () => {
  it.each([WINDOW_CASE, PUBLISHED_CASE])(
    'reads no habit at all off a setting the bag alone would have started at',
    (grinderCase: Case) => {
      for (const coffee of [UNKNOWN_COFFEE, DARK, LIGHT]) {
        const setting = startFor(grinderCase, coffee, null);

        expect(within(readBack(grinderCase, coffee, setting), 0, grinderCase.tolerance)).toBe(true);
      }
    },
  );

  it.each([WINDOW_CASE, PUBLISHED_CASE])(
    'reads back the habit a start was moved by, so a satisfied cup keeps the habit rather than erasing it',
    (grinderCase: Case) => {
      for (const habit of [FINER_HABIT, COARSER_HABIT]) {
        const setting = startFor(grinderCase, DARK, habit);

        expect(within(readBack(grinderCase, DARK, setting), habit, grinderCase.tolerance)).toBe(
          true,
        );
      }
    },
  );

  it('takes the bag back off, so the same setting is a coarser habit for a light roast than for a dark one', () => {
    const setting = startFor(WINDOW_CASE, UNKNOWN_COFFEE, null);
    const light = readBack(WINDOW_CASE, LIGHT, setting);
    const dark = readBack(WINDOW_CASE, DARK, setting);

    expect(light).not.toBeNull();
    expect(dark).not.toBeNull();
    expect(light ?? 0).toBeGreaterThan(dark ?? 0);
  });

  it('has nothing to read without a grinder, or off a collar nobody has measured', () => {
    expect(
      readGrindHabitShift({
        methodCategory: BREW_METHOD_CATEGORIES.pourOver,
        coffee: UNKNOWN_COFFEE,
        grinder: null,
        grindSetting: ANY_SETTING,
      }),
    ).toBeNull();
    expect(
      readGrindHabitShift({
        methodCategory: BREW_METHOD_CATEGORIES.pourOver,
        coffee: UNKNOWN_COFFEE,
        grinder: UNCALIBRATED_GRINDER,
        grindSetting: ANY_SETTING,
      }),
    ).toBeNull();
  });
});

describe('a habit handed back to the guidance', () => {
  const sourcesOf = (shifts: readonly GrindShift[]): readonly string[] =>
    shifts.map((shift: GrindShift): string => shift.source);

  it('is reported as its own reason, beside the bag', () => {
    const guidance = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.pourOver,
      coffee: DARK,
      grinder: MEASURED_GRINDER,
      habitShift: FINER_HABIT,
    });

    expect(sourcesOf(guidance.shifts)).toEqual([
      GRIND_SHIFT_SOURCES.roastLevel,
      GRIND_SHIFT_SOURCES.brewingHabit,
    ]);
  });

  it('moves the start the way the habit points', () => {
    const neutral = startFor(WINDOW_CASE, DARK, null);

    expect(startFor(WINDOW_CASE, DARK, FINER_HABIT)).toBeLessThan(neutral);
    expect(startFor(WINDOW_CASE, DARK, COARSER_HABIT)).toBeGreaterThan(neutral);
  });

  it('adds nothing and says nothing when there is no habit', () => {
    const guidance = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.pourOver,
      coffee: DARK,
      grinder: MEASURED_GRINDER,
      habitShift: 0,
    });

    expect(sourcesOf(guidance.shifts)).toEqual([GRIND_SHIFT_SOURCES.roastLevel]);
    expect(startFor(WINDOW_CASE, DARK, 0)).toBe(startFor(WINDOW_CASE, DARK, null));
  });

  it('is capped, so a habit read off a strange run cannot leave the family behind', () => {
    const guidance = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.pourOver,
      coffee: UNKNOWN_COFFEE,
      grinder: MEASURED_GRINDER,
      habitShift: FAR_TOO_FINE,
    });

    expect(guidance.shifts).toEqual([
      { source: GRIND_SHIFT_SOURCES.brewingHabit, amount: -HABIT_SHIFT_LIMIT },
    ]);
  });
});
