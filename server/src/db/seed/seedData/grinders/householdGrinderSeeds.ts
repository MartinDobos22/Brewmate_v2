import { BREW_METHOD_CATEGORIES, GRINDER_TYPICAL_USES, GRINDER_UNIT_TYPES } from '@brewmate/shared';

import { estimatedCalibration } from './estimatedCalibration.js';
import type { GrinderSeed } from './grinderSeed.js';

/**
 * The grinders people already own before they take coffee seriously.
 *
 * They belong in the catalogue for exactly that reason: somebody starting out
 * has to be able to pick their kitchen grinder rather than be told the app is
 * not for them. Their scales are coarse and unlabelled in microns. *
 * A handful of them now carry a curve after all. It is not a manufacturer
 * figure and does not pretend to be: it is fitted from where a published
 * grind-size chart puts each brewing method on that exact collar, the same way
 * `chartGrinderSeeds.ts` does it and only for the entries whose collar the
 * chart describes identically. Flagged as an estimate, like every other curve
 * here. A grind with a number and a click size beats a grind with neither, as
 * long as the app keeps saying which it is holding.
 */
export const HOUSEHOLD_GRINDER_SEEDS: readonly GrinderSeed[] = [
  {
    brand: "De'Longhi",
    model: 'KG 79',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 17,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },
  {
    brand: "De'Longhi",
    model: 'KG 200',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 17,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },
  {
    brand: "De'Longhi",
    model: 'KG 521',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 18,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    brand: 'Krups',
    model: 'GVX2',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 17,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 321 },
      { setting: 9, microns: 736 },
      { setting: 17, microns: 1151 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 1, max: 9 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 2, max: 10 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 1, max: 15 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 10, max: 17 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 13, max: 17 },
    },
    typicalUse: GRINDER_TYPICAL_USES.both,
  },
  {
    brand: 'Krups',
    model: 'GVX231',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 17,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    brand: 'Sboly',
    model: 'SYCG-801',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 19,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
];
