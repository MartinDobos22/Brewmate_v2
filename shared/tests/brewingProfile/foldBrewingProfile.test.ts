import { describe, expect, it } from 'vitest';

import {
  BREW_METHOD_CATEGORIES,
  HABIT_SHIFT_LIMIT,
  foldBrewingProfile,
  type BrewConstraints,
  type BrewedCup,
  type BrewingProfile,
  type GrindHabit,
  type MethodHabit,
} from '../../src/index.js';

const V60 = '00000000-0000-4000-8000-000000000101';
const KALITA = '00000000-0000-4000-8000-000000000102';
const AEROPRESS = '00000000-0000-4000-8000-000000000103';
const ETHIOPIA = 'bag-ethiopia';
const KENYA = 'bag-kenya';

const USUAL_DOSE = 15;
const USUAL_RATIO = 16;
const GUEST_RATIO = 12;
const USUAL_TEMPERATURE = 94;
const CABIN_TEMPERATURE = 100;
const ODD_RATIO = 15.8;
const ROUNDED_ODD_RATIO = 16;
const FINER_BY_HABIT = -0.3;
const TINY_HABIT = 0.05;
const STRANGE_RUN = -2;
const FULL_WEIGHT = 1;
const TWO = 2;
const THREE = 3;

const NOTHING_MISSING: BrewConstraints = {};

const cup = (overrides: Partial<BrewedCup>): BrewedCup => ({
  methodId: V60,
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  coffeeKey: ETHIOPIA,
  learningWeight: FULL_WEIGHT,
  isSuperseded: false,
  constraints: NOTHING_MISSING,
  doseGrams: USUAL_DOSE,
  ratio: USUAL_RATIO,
  waterTempC: USUAL_TEMPERATURE,
  grindShift: null,
  ...overrides,
});

const times = (count: number, overrides: Partial<BrewedCup>): readonly BrewedCup[] =>
  Array.from({ length: count }, (): BrewedCup => cup(overrides));

const methodOf = (profile: BrewingProfile, methodId: string): MethodHabit | undefined =>
  profile.methods.find((habit: MethodHabit): boolean => habit.methodId === methodId);

const grindOf = (profile: BrewingProfile): GrindHabit | undefined =>
  profile.grind.find(
    (habit: GrindHabit): boolean => habit.methodCategory === BREW_METHOD_CATEGORIES.pourOver,
  );

describe('the figures somebody weighs and pours', () => {
  it('counts every cup but states nothing until three of them agree to be counted', () => {
    const habit = methodOf(foldBrewingProfile(times(TWO, {})), V60);

    expect(habit).toEqual({
      methodId: V60,
      cupCount: TWO,
      doseGrams: null,
      ratio: null,
      waterTempC: null,
    });
  });

  it('takes the ratio they usually brew, not the average of it and the one they tried for a guest', () => {
    const profile = foldBrewingProfile([
      ...times(THREE, {}),
      ...times(TWO, { ratio: GUEST_RATIO }),
    ]);

    expect(methodOf(profile, V60)?.ratio).toBe(USUAL_RATIO);
  });

  it('rounds to the steps the form moves in', () => {
    const profile = foldBrewingProfile(times(THREE, { ratio: ODD_RATIO }));

    expect(methodOf(profile, V60)?.ratio).toBe(ROUNDED_ODD_RATIO);
  });

  it('lets a cup without a thermometer teach its dose but not its temperature', () => {
    const profile = foldBrewingProfile([
      ...times(TWO, {}),
      ...times(THREE, {
        waterTempC: CABIN_TEMPERATURE,
        constraints: { noTemperatureControl: true },
      }),
    ]);
    const habit = methodOf(profile, V60);

    expect(habit?.doseGrams).toBe(USUAL_DOSE);
    expect(habit?.waterTempC).toBeNull();
  });

  it('lets a cup without a scale teach its temperature but not its amounts', () => {
    const habit = methodOf(
      foldBrewingProfile(times(THREE, { constraints: { noScale: true } })),
      V60,
    );

    expect(habit?.doseGrams).toBeNull();
    expect(habit?.ratio).toBeNull();
    expect(habit?.waterTempC).toBe(USUAL_TEMPERATURE);
  });

  it('counts a version that was corrected and brewed again for less than the one they kept', () => {
    const profile = foldBrewingProfile([
      ...times(THREE, { ratio: GUEST_RATIO, isSuperseded: true }),
      ...times(TWO, {}),
    ]);

    expect(methodOf(profile, V60)?.ratio).toBe(USUAL_RATIO);
  });

  it('keeps each brewer apart, because nobody puts the same dose in all of them', () => {
    const profile = foldBrewingProfile([
      ...times(THREE, {}),
      ...times(THREE, { methodId: AEROPRESS, methodCategory: BREW_METHOD_CATEGORIES.immersion }),
    ]);

    expect(profile.methods.map((habit: MethodHabit): string => habit.methodId)).toEqual([
      V60,
      AEROPRESS,
    ]);
  });
});

describe('where somebody grinds, past what their bags explained', () => {
  it('does not call one coffee a habit, however many cups of it there were', () => {
    const habit = grindOf(foldBrewingProfile(times(THREE, { grindShift: FINER_BY_HABIT })));

    expect(habit).toEqual({
      methodCategory: BREW_METHOD_CATEGORIES.pourOver,
      cupCount: THREE,
      coffeeCount: 1,
      shift: null,
    });
  });

  it('calls it one once two coffees ended up in the same place', () => {
    const habit = grindOf(
      foldBrewingProfile([
        ...times(TWO, { grindShift: FINER_BY_HABIT }),
        ...times(TWO, { grindShift: FINER_BY_HABIT, coffeeKey: KENYA }),
      ]),
    );

    expect(habit?.shift).toBe(FINER_BY_HABIT);
    expect(habit?.coffeeCount).toBe(TWO);
  });

  it('reads the family rather than the brewer, because that is the unit the guidance moves in', () => {
    const habit = grindOf(
      foldBrewingProfile([
        ...times(TWO, { grindShift: FINER_BY_HABIT }),
        ...times(TWO, { grindShift: FINER_BY_HABIT, coffeeKey: KENYA, methodId: KALITA }),
      ]),
    );

    expect(habit?.cupCount).toBe(TWO + TWO);
    expect(habit?.shift).toBe(FINER_BY_HABIT);
  });

  it('reports a habit nobody could taste as none, which is not the same as not knowing', () => {
    const habit = grindOf(
      foldBrewingProfile([
        ...times(TWO, { grindShift: TINY_HABIT }),
        ...times(TWO, { grindShift: TINY_HABIT, coffeeKey: KENYA }),
      ]),
    );

    expect(habit?.shift).toBe(0);
  });

  it('caps a strange run at the habit allowance', () => {
    const habit = grindOf(
      foldBrewingProfile([
        ...times(TWO, { grindShift: STRANGE_RUN }),
        ...times(TWO, { grindShift: STRANGE_RUN, coffeeKey: KENYA }),
      ]),
    );

    expect(habit?.shift).toBe(-HABIT_SHIFT_LIMIT);
  });

  it('ignores a grind that was never where their own collar sat', () => {
    const habit = grindOf(
      foldBrewingProfile([
        ...times(TWO, { grindShift: FINER_BY_HABIT, constraints: { fixedGrindSetting: true } }),
        ...times(TWO, {
          grindShift: FINER_BY_HABIT,
          coffeeKey: KENYA,
          constraints: { borrowedEquipment: true },
        }),
      ]),
    );

    expect(habit?.cupCount).toBe(0);
    expect(habit?.shift).toBeNull();
  });
});
