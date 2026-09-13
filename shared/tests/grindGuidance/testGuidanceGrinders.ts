import {
  BREW_METHOD_CATEGORIES,
  GRINDER_TYPICAL_USES,
  GRINDER_UNIT_TYPES,
  type Grinder,
} from '../../src/index.js';

const MEASURED = false;
const VERIFIED = true;

const REVERSED_MIN_SETTING = 0;
const REVERSED_MAX_SETTING = 40;
const REVERSED_STEP = 1;
const REVERSED_COARSE_SETTING = 5;
const REVERSED_COARSE_MICRONS = 1000;
const REVERSED_FINE_SETTING = 35;
const REVERSED_FINE_MICRONS = 400;

const ESPRESSO_MIN_SETTING = 0;
const ESPRESSO_MAX_SETTING = 60;
const ESPRESSO_STEP = 1;
const ESPRESSO_FINE_MICRONS = 180;
const ESPRESSO_COARSE_MICRONS = 600;

/** Most of the catalogue has no published per-method range, and these fixtures say so. */
const NO_PUBLISHED_RANGES = null;

const CREATED_AT = '2026-01-01T00:00:00.000Z';
const NOBODY = null;

const grinderId = (suffix: string): string => `00000000-0000-4000-8000-0000000000${suffix}`;

/**
 * A collar marked the other way round: the higher number is the finer grind.
 *
 * Not a curiosity. Several grinders people actually own are numbered this way,
 * and every piece of arithmetic that assumed "bigger setting, coarser coffee"
 * prints its band backwards on all of them.
 */
export const REVERSED_GRINDER: Grinder = {
  id: grinderId('11'),
  brand: 'Testovací',
  model: 'Obrátený',
  unitType: GRINDER_UNIT_TYPES.numbers,
  minSetting: REVERSED_MIN_SETTING,
  maxSetting: REVERSED_MAX_SETTING,
  step: REVERSED_STEP,
  micronCalibration: {
    points: [
      { setting: REVERSED_COARSE_SETTING, microns: REVERSED_COARSE_MICRONS },
      { setting: REVERSED_FINE_SETTING, microns: REVERSED_FINE_MICRONS },
    ],
    isEstimated: MEASURED,
  },
  settingRanges: NO_PUBLISHED_RANGES,
  typicalUse: GRINDER_TYPICAL_USES.filter,
  isVerified: VERIFIED,
  createdByUserId: NOBODY,
  createdAt: CREATED_AT,
};

/** A fine espresso collar: sixty clicks across the range a filter grinder crosses in fourteen. */
export const ESPRESSO_GRINDER: Grinder = {
  id: grinderId('12'),
  brand: 'Testovací',
  model: 'Espresso',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: ESPRESSO_MIN_SETTING,
  maxSetting: ESPRESSO_MAX_SETTING,
  step: ESPRESSO_STEP,
  micronCalibration: {
    points: [
      { setting: ESPRESSO_MIN_SETTING, microns: ESPRESSO_FINE_MICRONS },
      { setting: ESPRESSO_MAX_SETTING, microns: ESPRESSO_COARSE_MICRONS },
    ],
    isEstimated: MEASURED,
  },
  settingRanges: NO_PUBLISHED_RANGES,
  typicalUse: GRINDER_TYPICAL_USES.espresso,
  isVerified: VERIFIED,
  createdByUserId: NOBODY,
  createdAt: CREATED_AT,
};

export const PUBLISHED_MIN_SETTING = 2;
export const PUBLISHED_MAX_SETTING = 25;
export const PUBLISHED_POUR_OVER_MIN = 11;
export const PUBLISHED_POUR_OVER_MAX = 18;

const PUBLISHED_ESPRESSO_MIN = 5;
const PUBLISHED_ESPRESSO_MAX = 10;
const PUBLISHED_FINE_MICRONS = 80;
const PUBLISHED_COARSE_MICRONS = 1100;

/**
 * A grinder whose maker publishes where each brew lives on the collar.
 *
 * Deliberately without a range for immersion, because that is the ordinary
 * case: a published chart covers the brews somebody thought to measure and the
 * rest has to fall back to the method window. A fixture that had all six would
 * never exercise the fallback.
 */
export const PUBLISHED_GRINDER: Grinder = {
  id: grinderId('13'),
  brand: 'Testovací',
  model: 'S odporúčaniami',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: PUBLISHED_MIN_SETTING,
  maxSetting: PUBLISHED_MAX_SETTING,
  step: REVERSED_STEP,
  micronCalibration: {
    points: [
      { setting: PUBLISHED_MIN_SETTING, microns: PUBLISHED_FINE_MICRONS },
      { setting: PUBLISHED_MAX_SETTING, microns: PUBLISHED_COARSE_MICRONS },
    ],
    isEstimated: MEASURED,
  },
  settingRanges: {
    [BREW_METHOD_CATEGORIES.espresso]: {
      min: PUBLISHED_ESPRESSO_MIN,
      max: PUBLISHED_ESPRESSO_MAX,
    },
    [BREW_METHOD_CATEGORIES.pourOver]: {
      min: PUBLISHED_POUR_OVER_MIN,
      max: PUBLISHED_POUR_OVER_MAX,
    },
  },
  typicalUse: GRINDER_TYPICAL_USES.both,
  isVerified: VERIFIED,
  createdByUserId: NOBODY,
  createdAt: CREATED_AT,
};
