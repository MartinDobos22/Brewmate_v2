import { describe, expect, it } from 'vitest';

import { micronsToSetting, settingToMicrons, snapToStep } from '../../src/index.js';

import {
  COARSE_HIGH_MICRONS,
  COARSE_HIGH_SETTING,
  COARSE_LOW_MICRONS,
  COARSE_LOW_SETTING,
  COARSE_MID_MICRONS,
  COARSE_MID_SETTING,
  MEASURED_GRINDER,
  UNCALIBRATED_GRINDER,
} from './testGrinders.js';

const BETWEEN_SETTING = 15;
const BETWEEN_MICRONS = 550;
const JUST_BELOW_SETTING = 8;
const JUST_BELOW_MICRONS = 340;
const FAR_BELOW_SETTING = -20;
const SINGLE_POINT_SETTING = 12;
const NOT_MEASURED = true;
const STEPLESS = 0;
const CLICKED_STEP = 5;
const OFF_STEP_SETTING = 13;
const ON_STEP_SETTING = 15;
const COLLAR_START = 0;
const OFFSET_COLLAR_START = 2;
const OFFSET_SNAPPED_SETTING = 12;

describe('reading a micron calibration curve', () => {
  const bounds = { min: MEASURED_GRINDER.minSetting, max: MEASURED_GRINDER.maxSetting };

  it('reads a measured point back as itself', () => {
    expect(settingToMicrons(MEASURED_GRINDER.micronCalibration, COARSE_MID_SETTING)?.value).toBe(
      COARSE_MID_MICRONS,
    );
  });

  it('interpolates linearly between two measured points', () => {
    const reading = settingToMicrons(MEASURED_GRINDER.micronCalibration, BETWEEN_SETTING);

    expect(reading?.value).toBe(BETWEEN_MICRONS);
    expect(reading?.isExtrapolated).toBe(false);
  });

  /**
   * A curve describes the range somebody measured. Carrying it a little past
   * the last point is useful; doing so silently is not, because the number
   * that comes out looks exactly like the ones that were measured.
   */
  it('extends the nearest segment past the end of the curve, and says that it did', () => {
    const reading = settingToMicrons(MEASURED_GRINDER.micronCalibration, JUST_BELOW_SETTING);

    expect(reading?.value).toBe(JUST_BELOW_MICRONS);
    expect(reading?.isExtrapolated).toBe(true);
  });

  it('refuses to read a setting far outside the measured span', () => {
    expect(settingToMicrons(MEASURED_GRINDER.micronCalibration, FAR_BELOW_SETTING)).toBeNull();
  });

  it('has nothing to say about a grinder with no curve', () => {
    expect(settingToMicrons(UNCALIBRATED_GRINDER.micronCalibration, COARSE_MID_SETTING)).toBeNull();
  });

  /** One point fixes a position but not a slope, so there is nothing to read along. */
  it('has nothing to say about a curve with a single point', () => {
    const calibration = {
      points: [{ setting: SINGLE_POINT_SETTING, microns: COARSE_MID_MICRONS }],
      isEstimated: NOT_MEASURED,
    };

    expect(settingToMicrons(calibration, SINGLE_POINT_SETTING)).toBeNull();
  });

  it('reads the curve backwards to find the setting for a particle size', () => {
    expect(
      micronsToSetting(MEASURED_GRINDER.micronCalibration, BETWEEN_MICRONS, bounds)?.value,
    ).toBe(BETWEEN_SETTING);
  });

  /**
   * The two directions have to agree, or a recipe converted from one grinder
   * to another and back again would drift - which is exactly the arithmetic
   * this module exists to be trusted about.
   */
  it('round-trips a setting through microns and back', () => {
    const microns = settingToMicrons(MEASURED_GRINDER.micronCalibration, COARSE_LOW_SETTING);
    const back =
      microns === null
        ? null
        : micronsToSetting(MEASURED_GRINDER.micronCalibration, microns.value, bounds);

    expect(microns?.value).toBe(COARSE_LOW_MICRONS);
    expect(back?.value).toBe(COARSE_LOW_SETTING);
  });

  it('never reports a setting outside the collar it belongs to', () => {
    const reading = micronsToSetting(MEASURED_GRINDER.micronCalibration, COARSE_HIGH_MICRONS, {
      min: MEASURED_GRINDER.minSetting,
      max: COARSE_MID_SETTING,
    });

    expect(reading?.value).toBe(COARSE_MID_SETTING);
    expect(COARSE_HIGH_SETTING).toBeGreaterThan(COARSE_MID_SETTING);
  });
});

describe('snapping a setting to what the collar can be left at', () => {
  it('rounds to the nearest detent on a clicked grinder', () => {
    expect(snapToStep(OFF_STEP_SETTING, CLICKED_STEP, COLLAR_START)).toBe(ON_STEP_SETTING);
  });

  it('leaves a stepless collar alone', () => {
    expect(snapToStep(OFF_STEP_SETTING, STEPLESS, COLLAR_START)).toBe(OFF_STEP_SETTING);
  });

  /**
   * Detents are counted from where the collar starts, not from zero. A grinder
   * whose scale begins at 2 has clicks at 2, 7 and 12 - and 15 is not one of
   * them, however round it looks.
   */
  it('counts detents from the collar minimum rather than from zero', () => {
    expect(snapToStep(OFF_STEP_SETTING, CLICKED_STEP, OFFSET_COLLAR_START)).toBe(
      OFFSET_SNAPPED_SETTING,
    );
  });
});
