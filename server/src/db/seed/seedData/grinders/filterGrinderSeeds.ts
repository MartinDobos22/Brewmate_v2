import { BREW_METHOD_CATEGORIES, GRINDER_TYPICAL_USES, GRINDER_UNIT_TYPES } from '@brewmate/shared';

import { estimatedCalibration } from './estimatedCalibration.js';
import type { GrinderSeed } from './grinderSeed.js';

/**
 * Electric grinders built around filter brewing.
 *
 * Their dials print numbers rather than counting clicks, and the
 * manufacturers publish no micron figure for any of them. A stepless dial is
 * recorded with a step of zero. *
 * A handful of them now carry a curve after all. It is not a manufacturer
 * figure and does not pretend to be: it is fitted from where a published
 * grind-size chart puts each brewing method on that exact collar, the same way
 * `chartGrinderSeeds.ts` does it and only for the entries whose collar the
 * chart describes identically. Flagged as an estimate, like every other curve
 * here. A grind with a number and a click size beats a grind with neither, as
 * long as the app keeps saying which it is holding.
 */
export const FILTER_GRINDER_SEEDS: readonly GrinderSeed[] = [
  {
    brand: 'Baratza',
    model: 'Encore',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 40,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 285 },
      { setting: 20, microns: 757 },
      { setting: 40, microns: 1229 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 1, max: 5 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 5, max: 17 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 7, max: 18 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 3, max: 27 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 19, max: 40 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 24, max: 40 },
    },
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
  {
    brand: 'Baratza',
    model: 'Encore ESP',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 40,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 119 },
      { setting: 20, microns: 655 },
      { setting: 40, microns: 1191 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 1, max: 13 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 12, max: 24 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 15, max: 25 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 7, max: 29 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 25, max: 38 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 27, max: 40 },
    },
    typicalUse: GRINDER_TYPICAL_USES.both,
  },
  {
    brand: 'Baratza',
    model: 'Virtuoso+',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 40,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 246 },
      { setting: 20, microns: 738 },
      { setting: 40, microns: 1229 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 1, max: 7 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 7, max: 18 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 8, max: 20 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 4, max: 28 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 20, max: 40 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 24, max: 40 },
    },
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
  {
    brand: 'Baratza',
    model: 'Sette 270',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 31,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 200 },
      { setting: 16, microns: 663 },
      { setting: 31, microns: 1125 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 1, max: 7 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 7, max: 18 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 9, max: 20 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 4, max: 28 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 21, max: 31 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 25, max: 31 },
    },
    typicalUse: GRINDER_TYPICAL_USES.espresso,
  },

  {
    brand: 'Fellow',
    model: 'Ode Gen 1',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 11,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
  {
    brand: 'Fellow',
    model: 'Ode Gen 2',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 11,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
  {
    brand: 'Fellow',
    model: 'Opus',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 11,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 257 },
      { setting: 6, microns: 738 },
      { setting: 11, microns: 1220 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 1, max: 2.5 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 2.5, max: 5.5 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 3, max: 6 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 2, max: 8 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 6, max: 11 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 7.25, max: 11 },
    },
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    brand: 'Wilfa',
    model: 'Uniform',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 40,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 1, microns: 199 },
      { setting: 21, microns: 678 },
      { setting: 40, microns: 1158 },
    ]),
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 1, max: 9 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 9, max: 23 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 11, max: 25 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 6, max: 35 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 25, max: 40 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 31, max: 40 },
    },
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
  {
    brand: 'Wilfa',
    model: 'Uniform+',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 1,
    maxSetting: 40,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },

  {
    brand: 'Mahlkönig',
    model: 'EK43',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 0,
    maxSetting: 11,
    step: 0,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    brand: 'Varia',
    model: 'VS3',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 0,
    maxSetting: 90,
    step: 0,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },
];
