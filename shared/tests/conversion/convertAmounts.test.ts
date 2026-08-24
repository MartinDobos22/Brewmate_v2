import { describe, expect, it } from 'vitest';

import {
  BREW_METHOD_CATEGORIES,
  CONVERSION_PRECISIONS,
  CONVERSION_REASONS,
  convertAmounts,
  resolveRatio,
  type ConversionField,
  type ConversionNote,
} from '../../src/index.js';

import {
  ESPRESSO_TARGET,
  V60_RATIO_MAX,
  V60_TARGET,
  sourceRecipe,
} from './testConversionTarget.js';

const SOURCE_DOSE = 30;
const SOURCE_WATER = 500;
const SOURCE_RATIO = 16.7;

const SMALL_BREWER_CAPACITY_ML = 300;
const CAPPED_WATER_GRAMS = 270;
const CAPPED_DOSE_GRAMS = 16.2;

const BASKET_MAX_DOSE = 20;
const BASKET_MIN_DOSE = 16;

const ESPRESSO_DOSE = 18;
const ESPRESSO_YIELD = 36;

const noteFor = (
  notes: readonly ConversionNote[],
  field: ConversionField,
): ConversionNote | undefined =>
  notes.find((note: ConversionNote): boolean => note.field === field);

describe('converting amounts onto another brewer', () => {
  /**
   * The ratio is the decision the recipe author made about strength and
   * extraction; the dose is a decision about how much coffee they wanted. Only
   * the second one is invalidated by owning a smaller dripper.
   */
  it('keeps the source amounts untouched when the brewer can take them', () => {
    const converted = convertAmounts(
      sourceRecipe({ doseGrams: SOURCE_DOSE, waterGrams: SOURCE_WATER }),
      V60_TARGET,
    );

    expect(converted.doseGrams).toBe(SOURCE_DOSE);
    expect(converted.waterGrams).toBe(SOURCE_WATER);
    expect(noteFor(converted.notes, 'dose')?.precision).toBe(CONVERSION_PRECISIONS.exact);
  });

  it('divides the ratio out of the two weights rather than trusting the one given', () => {
    const converted = convertAmounts(
      sourceRecipe({ doseGrams: SOURCE_DOSE, waterGrams: SOURCE_WATER, ratio: V60_RATIO_MAX }),
      V60_TARGET,
    );

    expect(converted.ratio).toBe(resolveRatio(SOURCE_DOSE, SOURCE_WATER));
    expect(converted.ratio).not.toBe(V60_RATIO_MAX);
  });

  /**
   * Scaled down at the source's own ratio, which is the whole instruction:
   * a smaller brewer means less coffee, not different coffee.
   */
  it('scales both weights down to what the brewer holds, at the same ratio', () => {
    const converted = convertAmounts(
      sourceRecipe({ doseGrams: SOURCE_DOSE, waterGrams: SOURCE_WATER }),
      { ...V60_TARGET, brewer: { ...V60_TARGET.brewer, capacityMl: SMALL_BREWER_CAPACITY_ML } },
    );

    expect(converted.waterGrams).toBe(CAPPED_WATER_GRAMS);
    expect(converted.doseGrams).toBe(CAPPED_DOSE_GRAMS);
    expect(converted.ratio).toBe(resolveRatio(SOURCE_DOSE, SOURCE_WATER));
    expect(noteFor(converted.notes, 'water')?.reason).toBe(CONVERSION_REASONS.scaledToCapacity);
  });

  it('brings a dose into the window the brewer works in', () => {
    const converted = convertAmounts(
      sourceRecipe({ doseGrams: SOURCE_DOSE, ratio: SOURCE_RATIO }),
      {
        ...ESPRESSO_TARGET,
        brewer: {
          capacityMl: null,
          doseMinGrams: BASKET_MIN_DOSE,
          doseMaxGrams: BASKET_MAX_DOSE,
        },
      },
    );

    expect(converted.doseGrams).toBe(BASKET_MAX_DOSE);
    expect(noteFor(converted.notes, 'dose')?.reason).toBe(CONVERSION_REASONS.scaledToDoseWindow);
    expect(noteFor(converted.notes, 'dose')?.precision).toBe(CONVERSION_PRECISIONS.estimated);
  });

  /**
   * Within a family the ratio is untouchable. Across one it is not character
   * but a category error - an espresso's 1:2 poured through a V60 is not a
   * strong V60, it is mud.
   */
  it('brings a ratio from another family of brewer inside this method window', () => {
    const converted = convertAmounts(
      sourceRecipe({
        methodCategory: BREW_METHOD_CATEGORIES.espresso,
        doseGrams: ESPRESSO_DOSE,
        waterGrams: ESPRESSO_YIELD,
      }),
      V60_TARGET,
    );

    expect(converted.ratio).toBe(V60_TARGET.ratioRange.min);
    expect(noteFor(converted.notes, 'ratio')?.reason).toBe(
      CONVERSION_REASONS.clampedToMethodWindow,
    );
  });

  it('leaves a ratio alone when the source was the same family of brewer', () => {
    const converted = convertAmounts(
      sourceRecipe({
        methodCategory: BREW_METHOD_CATEGORIES.pourOver,
        doseGrams: SOURCE_DOSE,
        waterGrams: SOURCE_WATER,
      }),
      V60_TARGET,
    );

    expect(converted.ratio).toBe(resolveRatio(SOURCE_DOSE, SOURCE_WATER));
  });

  /** A recipe still has to have a dose, but nobody should mistake it for one. */
  it('reports amounts as unknown when the source never stated any', () => {
    const converted = convertAmounts(sourceRecipe({}), V60_TARGET);

    expect(noteFor(converted.notes, 'dose')?.precision).toBe(CONVERSION_PRECISIONS.unknown);
    expect(noteFor(converted.notes, 'dose')?.reason).toBe(CONVERSION_REASONS.notStatedInSource);
    expect(converted.doseGrams).toBeGreaterThan(0);
  });
});
