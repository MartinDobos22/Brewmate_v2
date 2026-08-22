import { GRINDER_TYPICAL_USES, GRINDER_UNIT_TYPES } from '@brewmate/shared';

import type { GrinderSeed } from './grinderSeed.js';

/**
 * The grinders people already own before they take coffee seriously.
 *
 * They belong in the catalogue for exactly that reason: somebody starting out
 * has to be able to pick their kitchen grinder rather than be told the app is
 * not for them. Their scales are coarse and unlabelled in microns, so there is
 * no curve to record.
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
    micronCalibration: null,
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
