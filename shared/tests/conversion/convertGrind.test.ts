import { describe, expect, it } from 'vitest';

import {
  BREW_METHOD_CATEGORIES,
  CONVERSION_PRECISIONS,
  CONVERSION_REASONS,
  GRIND_DESCRIPTORS,
  convertGrind,
  type ConversionNote,
  type ConversionReason,
} from '../../src/index.js';

import {
  CONTRIBUTED_GRINDER,
  ESTIMATED_GRINDER,
  MEASURED_GRINDER,
  UNCALIBRATED_GRINDER,
  COARSE_MID_SETTING,
  COARSE_MID_MICRONS,
  FINE_LOW_MICRONS,
  FINE_LOW_SETTING,
} from './testGrinders.js';
import { V60_TARGET, sourceRecipe } from './testConversionTarget.js';

/** 700 microns on the fine collar: 20 clicks at 400, plus 30 clicks of 10. */
const EQUIVALENT_FINE_SETTING = 50;
const CANNOT_GRIND = false;
const OFF_CURVE_SETTING = 35;

const reasons = (notes: readonly ConversionNote[]): readonly ConversionReason[] =>
  notes.map((note: ConversionNote): ConversionReason => note.reason);

describe('converting a grind between two grinders', () => {
  it('translates one collar into the other through microns', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: COARSE_MID_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: ESTIMATED_GRINDER },
    );

    expect(converted.microns).toBe(COARSE_MID_MICRONS);
    expect(converted.setting).toBe(EQUIVALENT_FINE_SETTING);
    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.fromBothCalibrations);
  });

  /**
   * The spec is explicit about this one: an estimated calibration has to be
   * said out loud rather than folded into a general hedge, because it is the
   * difference between a number read off a measurement and a number read off a
   * manufacturer's marketing sheet.
   */
  it('says so when one of the two curves is only an estimate', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: COARSE_MID_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: ESTIMATED_GRINDER },
    );

    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.calibrationEstimated);
  });

  it('says so when a catalogue entry is somebody own contribution', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: COARSE_MID_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: CONTRIBUTED_GRINDER },
    );

    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.grinderUnverified);
  });

  /**
   * Never `exact`, whatever the inputs. Burr alignment and bean density move a
   * real grind further than the difference between two published curves, so a
   * converted grind is where dialling in starts.
   */
  it('never claims a converted grind is exact', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: COARSE_MID_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: MEASURED_GRINDER },
    );

    expect(
      converted.notes.every(
        (note: ConversionNote): boolean => note.precision !== CONVERSION_PRECISIONS.exact,
      ),
    ).toBe(true);
  });

  it('recovers the grind from how it was described when no grinder is known', () => {
    const converted = convertGrind(
      sourceRecipe({ grindLabel: 'stredne hrubé, ako morská soľ' }),
      null,
      { ...V60_TARGET, grinder: MEASURED_GRINDER },
    );

    expect(converted.descriptor).toBe(GRIND_DESCRIPTORS.mediumCoarse);
    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.fromGrindWords);
  });

  it('falls back to what the method normally wants when nothing was said', () => {
    const converted = convertGrind(
      sourceRecipe({ methodCategory: BREW_METHOD_CATEGORIES.espresso }),
      null,
      { ...V60_TARGET, grinder: MEASURED_GRINDER },
    );

    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.fromMethodCategory);
    expect(converted.descriptor).toBe(GRIND_DESCRIPTORS.fine);
  });

  it('gives words instead of a number when their grinder has no curve', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: COARSE_MID_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: UNCALIBRATED_GRINDER },
    );

    expect(converted.setting).toBeNull();
    expect(converted.descriptor).toBe(GRIND_DESCRIPTORS.medium);
    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.targetGrinderUncalibrated);
  });

  /** Pre-ground coffee has no grind to convert, and saying so beats a number. */
  it('gives no grind at all when the grind cannot be moved', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: COARSE_MID_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: MEASURED_GRINDER, canAdjustGrind: CANNOT_GRIND },
    );

    expect(converted.setting).toBeNull();
    expect(converted.microns).toBeNull();
    expect(reasons(converted.notes)).toEqual([CONVERSION_REASONS.grindNotAdjustable]);
  });

  it('admits when a reading ran off the end of the measured curve', () => {
    const converted = convertGrind(
      sourceRecipe({ grindSetting: OFF_CURVE_SETTING }),
      MEASURED_GRINDER,
      { ...V60_TARGET, grinder: MEASURED_GRINDER },
    );

    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.outsideCalibratedRange);
  });

  it('takes a stated particle size over anything it would have to infer', () => {
    const converted = convertGrind(
      sourceRecipe({ grindMicrons: FINE_LOW_MICRONS, grindLabel: 'veľmi hrubé' }),
      null,
      { ...V60_TARGET, grinder: ESTIMATED_GRINDER },
    );

    expect(converted.setting).toBe(FINE_LOW_SETTING);
    expect(reasons(converted.notes)).toContain(CONVERSION_REASONS.fromStatedMicrons);
  });
});
