import { BREW_METHOD_CATEGORIES, GRINDER_TYPICAL_USES, GRINDER_UNIT_TYPES } from '@brewmate/shared';

import { estimatedCalibration } from './estimatedCalibration.js';
import type { GrinderSeed } from './grinderSeed.js';

/**
 * Hand grinders, which count in clicks from the burrs touching.
 *
 * A click means nothing on its own - 20 clicks is espresso on one grinder and
 * French press on another - so the only thing that makes two of them
 * comparable is the micron curve, and the curve is only present where the
 * manufacturer publishes a microns-per-click figure. Where it is absent, it is
 * absent on purpose: an invented number would be worse than none.
 */
export const HAND_GRINDER_SEEDS: readonly GrinderSeed[] = [
  {
    brand: 'Comandante',
    model: 'C40 MK3',
    unitType: GRINDER_UNIT_TYPES.clicks,
    minSetting: 2,
    maxSetting: 40,
    step: 1,
    micronCalibration: estimatedCalibration([
      { setting: 2.36, microns: 80 },
      { setting: 21.18, microns: 628 },
      { setting: 40, microns: 1176 },
    ]),
    /**
     * Taken from the MK4, which is the same grinder: the two share burrs, axle
     * and click mechanism, and what changed between them is the body. Copying
     * a sibling's numbers is a claim, so it is only done where the mechanism is
     * identical - not between, say, a C40 and a C40 with the Red Clix fitted,
     * which really does count differently.
     */
    settingRanges: {
      [BREW_METHOD_CATEGORIES.espresso]: { min: 7, max: 13 },
      [BREW_METHOD_CATEGORIES.stovetop]: { min: 14, max: 24 },
      [BREW_METHOD_CATEGORIES.pourOver]: { min: 15, max: 25 },
      [BREW_METHOD_CATEGORIES.batch]: { min: 12, max: 33 },
      [BREW_METHOD_CATEGORIES.immersion]: { min: 26, max: 40 },
      [BREW_METHOD_CATEGORIES.cold]: { min: 30, max: 40 },
    },
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    brand: '1Zpresso',
    model: 'JE-Plus',
    unitType: GRINDER_UNIT_TYPES.clicks,
    minSetting: 0,
    maxSetting: 60,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },
  {
    brand: '1Zpresso',
    model: 'Q2',
    unitType: GRINDER_UNIT_TYPES.clicks,
    minSetting: 0,
    maxSetting: 36,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.filter,
  },

  {
    brand: 'Timemore',
    model: 'Chestnut X-Lite',
    unitType: GRINDER_UNIT_TYPES.clicks,
    minSetting: 0,
    maxSetting: 60,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    /** Stepless: the dial is numbered, but it stops nowhere in particular. */
    brand: 'Kinu',
    model: 'M47',
    unitType: GRINDER_UNIT_TYPES.numbers,
    minSetting: 0,
    maxSetting: 50,
    step: 0,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },

  {
    brand: 'Normcore',
    model: 'Hand Grinder V2',
    unitType: GRINDER_UNIT_TYPES.clicks,
    minSetting: 0,
    maxSetting: 60,
    step: 1,
    micronCalibration: null,
    typicalUse: GRINDER_TYPICAL_USES.both,
  },
];
