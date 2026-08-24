import { GRINDER_TYPICAL_USES, GRINDER_UNIT_TYPES, type Grinder } from '../../src/index.js';

const COARSE_MICRONS_PER_CLICK = 30;
const FINE_MICRONS_PER_CLICK = 10;

const COARSE_MIN_SETTING = 0;
const COARSE_MAX_SETTING = 50;
const COARSE_STEP = 1;
const COARSE_LOW_SETTING = 10;
const COARSE_MID_SETTING = 20;
const COARSE_HIGH_SETTING = 30;
const COARSE_LOW_MICRONS = 400;
const COARSE_MID_MICRONS = 700;
const COARSE_HIGH_MICRONS = 1000;

const FINE_MIN_SETTING = 0;
const FINE_MAX_SETTING = 120;
const FINE_STEP = 1;
const FINE_LOW_SETTING = 20;
const FINE_HIGH_SETTING = 60;
const FINE_LOW_MICRONS = 400;
const FINE_HIGH_MICRONS = 800;

const STEPLESS = 0;
const STEPLESS_MAX_SETTING = 50;

const MEASURED = false;
const ESTIMATED = true;
const VERIFIED = true;
const CONTRIBUTED = false;

const CREATED_AT = '2026-01-01T00:00:00.000Z';
const NOBODY = null;

const grinderId = (suffix: string): string => `00000000-0000-4000-8000-00000000000${suffix}`;

/**
 * A grinder whose collar is worth exactly 30 microns a click, measured.
 *
 * The numbers are round on purpose: a test that has to reproduce the
 * interpolation to know what to expect is a test that passes whenever the
 * interpolation is wrong in the same way twice.
 */
export const MEASURED_GRINDER: Grinder = {
  id: grinderId('1'),
  brand: 'Testovací',
  model: 'Hrubý',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: COARSE_MIN_SETTING,
  maxSetting: COARSE_MAX_SETTING,
  step: COARSE_STEP,
  micronCalibration: {
    points: [
      { setting: COARSE_LOW_SETTING, microns: COARSE_LOW_MICRONS },
      { setting: COARSE_MID_SETTING, microns: COARSE_MID_MICRONS },
      { setting: COARSE_HIGH_SETTING, microns: COARSE_HIGH_MICRONS },
    ],
    isEstimated: MEASURED,
  },
  typicalUse: GRINDER_TYPICAL_USES.filter,
  isVerified: VERIFIED,
  createdByUserId: NOBODY,
  createdAt: CREATED_AT,
};

/** A finer collar - 10 microns a click - whose curve is only an estimate. */
export const ESTIMATED_GRINDER: Grinder = {
  id: grinderId('2'),
  brand: 'Testovací',
  model: 'Jemný',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: FINE_MIN_SETTING,
  maxSetting: FINE_MAX_SETTING,
  step: FINE_STEP,
  micronCalibration: {
    points: [
      { setting: FINE_LOW_SETTING, microns: FINE_LOW_MICRONS },
      { setting: FINE_HIGH_SETTING, microns: FINE_HIGH_MICRONS },
    ],
    isEstimated: ESTIMATED,
  },
  typicalUse: GRINDER_TYPICAL_USES.both,
  isVerified: VERIFIED,
  createdByUserId: NOBODY,
  createdAt: CREATED_AT,
};

/** Somebody's own contribution to the catalogue, with the same curve. */
export const CONTRIBUTED_GRINDER: Grinder = {
  ...ESTIMATED_GRINDER,
  id: grinderId('3'),
  isVerified: CONTRIBUTED,
};

/** A stepless espresso grinder nobody has ever put a micron figure to. */
export const UNCALIBRATED_GRINDER: Grinder = {
  id: grinderId('4'),
  brand: 'Testovací',
  model: 'Bez krivky',
  unitType: GRINDER_UNIT_TYPES.numbers,
  minSetting: COARSE_MIN_SETTING,
  maxSetting: STEPLESS_MAX_SETTING,
  step: STEPLESS,
  micronCalibration: null,
  typicalUse: GRINDER_TYPICAL_USES.espresso,
  isVerified: VERIFIED,
  createdByUserId: NOBODY,
  createdAt: CREATED_AT,
};

export {
  COARSE_MICRONS_PER_CLICK,
  FINE_MICRONS_PER_CLICK,
  COARSE_LOW_SETTING,
  COARSE_LOW_MICRONS,
  COARSE_MID_SETTING,
  COARSE_MID_MICRONS,
  COARSE_HIGH_SETTING,
  COARSE_HIGH_MICRONS,
  FINE_LOW_SETTING,
  FINE_LOW_MICRONS,
  FINE_HIGH_SETTING,
  FINE_HIGH_MICRONS,
};
