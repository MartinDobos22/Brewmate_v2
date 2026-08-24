import { describe, expect, it } from 'vitest';

import {
  BREW_METHOD_CATEGORIES,
  CONVERSION_PRECISIONS,
  CONVERSION_REASONS,
  DEFAULT_WATER_TEMP_C,
  convertRecipe,
  type BrewStep,
  type ConversionField,
  type ConversionNote,
} from '../../src/index.js';

import { MEASURED_GRINDER, COARSE_MID_SETTING } from './testGrinders.js';
import { ESPRESSO_TARGET, V60_TARGET, sourceRecipe } from './testConversionTarget.js';

const SOURCE_DOSE = 30;
const SOURCE_WATER = 500;
const HALF_CAPACITY_ML = 300;
const SOURCE_TEMP_C = 92;
const SOURCE_TOTAL_SECONDS = 180;
const BLOOM_WATER = 60;
const FINAL_WATER = 500;
const BLOOM_AT = 0;
const POUR_AT = 45;
const FIRST_STEP = 0;
const LAST_STEP = 1;
const SCALED_BLOOM_WATER = 32.4;
const ESPRESSO_DOSE = 18;
const ESPRESSO_YIELD = 36;
const ESPRESSO_SECONDS = 28;
const PRE_INFUSION = 5;
const NO_TEMPERATURE_CONTROL = false;

const STEPS: readonly BrewStep[] = [
  { order: FIRST_STEP, label: 'Bloom', atSecond: BLOOM_AT, waterGrams: BLOOM_WATER, note: null },
  { order: LAST_STEP, label: 'Dolievanie', atSecond: POUR_AT, waterGrams: FINAL_WATER, note: null },
];

const noteFor = (
  notes: readonly ConversionNote[],
  field: ConversionField,
): ConversionNote | undefined =>
  notes.find((note: ConversionNote): boolean => note.field === field);

const pourOverRecipe = sourceRecipe({
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  doseGrams: SOURCE_DOSE,
  waterGrams: SOURCE_WATER,
  grindSetting: COARSE_MID_SETTING,
  waterTempC: SOURCE_TEMP_C,
  totalTimeSeconds: SOURCE_TOTAL_SECONDS,
  steps: [...STEPS],
});

describe('converting a whole recipe', () => {
  /** A temperature is the one number that converts perfectly: 92 °C is 92 °C. */
  it('carries a temperature across untouched, and says it is exact', () => {
    const converted = convertRecipe(pourOverRecipe, MEASURED_GRINDER, V60_TARGET);

    expect(converted.waterTempC).toBe(SOURCE_TEMP_C);
    expect(noteFor(converted.notes, 'temperature')?.precision).toBe(CONVERSION_PRECISIONS.exact);
  });

  /**
   * No number at all, rather than a number with an apology attached. What they
   * get instead is a procedure, and the recipe already has somewhere to carry
   * one: the constraint hint every brew without temperature control gets.
   */
  it('gives no temperature to somebody who cannot set one', () => {
    const converted = convertRecipe(pourOverRecipe, MEASURED_GRINDER, {
      ...V60_TARGET,
      hasTemperatureControl: NO_TEMPERATURE_CONTROL,
    });

    expect(converted.waterTempC).toBeNull();
    expect(noteFor(converted.notes, 'temperature')?.reason).toBe(
      CONVERSION_REASONS.noTemperatureControl,
    );
  });

  it('falls back to the usual temperature for the method when the source was silent', () => {
    const converted = convertRecipe(
      sourceRecipe({ doseGrams: SOURCE_DOSE, waterGrams: SOURCE_WATER }),
      null,
      V60_TARGET,
    );

    expect(converted.waterTempC).toBe(DEFAULT_WATER_TEMP_C[V60_TARGET.methodCategory]);
    expect(noteFor(converted.notes, 'temperature')?.precision).toBe(CONVERSION_PRECISIONS.unknown);
  });

  it('leaves an unscaled pour schedule exactly as it was written', () => {
    const converted = convertRecipe(pourOverRecipe, MEASURED_GRINDER, V60_TARGET);

    expect(converted.steps).toEqual(STEPS);
    expect(converted.scheduleMayBeRewritten).toBe(false);
    expect(noteFor(converted.notes, 'schedule')?.precision).toBe(CONVERSION_PRECISIONS.exact);
  });

  /**
   * The shape of the pour is what carries over: a bloom that was a sixth of
   * the water is still a sixth of it. The times do not move with the weights -
   * a bloom lasts as long as the coffee degasses, not as long as the brew is
   * big.
   */
  it('scales a pour schedule with the water it pours, and leaves its times alone', () => {
    const converted = convertRecipe(pourOverRecipe, MEASURED_GRINDER, {
      ...V60_TARGET,
      brewer: { ...V60_TARGET.brewer, capacityMl: HALF_CAPACITY_ML },
    });

    expect(converted.steps[FIRST_STEP]?.waterGrams).toBe(SCALED_BLOOM_WATER);
    expect(converted.steps[LAST_STEP]?.waterGrams).toBe(converted.waterGrams);
    expect(converted.steps[LAST_STEP]?.atSecond).toBe(POUR_AT);
    expect(noteFor(converted.notes, 'schedule')?.reason).toBe(CONVERSION_REASONS.scaledWithWater);
  });

  /**
   * A V60's three pours mean nothing in a portafilter. Carrying them across
   * would produce a recipe that looks precise and instructs somebody to do
   * something their machine cannot do.
   */
  it('drops a schedule written for a different family of brewer', () => {
    const converted = convertRecipe(pourOverRecipe, MEASURED_GRINDER, ESPRESSO_TARGET);

    expect(converted.steps).toEqual([]);
    expect(converted.totalTimeSeconds).toBeNull();
    expect(converted.scheduleMayBeRewritten).toBe(true);
    expect(noteFor(converted.notes, 'schedule')?.reason).toBe(
      CONVERSION_REASONS.differentMethodCategory,
    );
  });

  it('keeps a pre-infusion only when both machines are espresso machines', () => {
    const espresso = sourceRecipe({
      methodCategory: BREW_METHOD_CATEGORIES.espresso,
      doseGrams: ESPRESSO_DOSE,
      waterGrams: ESPRESSO_YIELD,
      totalTimeSeconds: ESPRESSO_SECONDS,
      preInfusionSeconds: PRE_INFUSION,
    });

    expect(convertRecipe(espresso, null, ESPRESSO_TARGET).preInfusionSeconds).toBe(PRE_INFUSION);
    expect(convertRecipe(espresso, null, V60_TARGET).preInfusionSeconds).toBeNull();
  });

  /** Every field the report covers gets a verdict, or the card can lie by omission. */
  it('says something about every part of the recipe it converted', () => {
    const converted = convertRecipe(pourOverRecipe, MEASURED_GRINDER, V60_TARGET);
    const fields = new Set(
      converted.notes.map((note: ConversionNote): ConversionField => note.field),
    );

    expect([...fields].sort()).toEqual([
      'dose',
      'grind',
      'ratio',
      'schedule',
      'temperature',
      'time',
      'water',
    ]);
  });
});
