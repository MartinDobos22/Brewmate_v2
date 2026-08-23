import { ROAST_LEVEL_VALUES, type RoastLevel } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../i18n';
import { BAG_SCAN_FIELDS, ROAST_LEVEL_NEAR_DISTANCE } from '../constants/bagScan';

import type { BagVerdictParts } from './bagVerdictTypes';

const NO_PARTS: BagVerdictParts = { points: [], uncertainties: [] };

const distance = (first: RoastLevel, second: RoastLevel): number =>
  Math.abs(ROAST_LEVEL_VALUES.indexOf(first) - ROAST_LEVEL_VALUES.indexOf(second));

/**
 * How the roast on the label compares with the roast this person reaches for.
 *
 * The levels are ordered light to dark, so "how far apart" is a real distance
 * rather than an equality test - a medium next to a medium-light is the same
 * answer as far as anybody's tongue is concerned, and calling that a mismatch
 * would make the app disagree with people over nothing.
 */
export const readRoastFit = (
  labelRoast: RoastLevel | undefined,
  preferred: RoastLevel | null,
): BagVerdictParts => {
  if (labelRoast === undefined) {
    return {
      points: [],
      uncertainties: [
        { field: BAG_SCAN_FIELDS.roastLevel, reasonKey: TRANSLATION_KEYS.scanReasonNoRoast },
      ],
    };
  }

  if (preferred === null) {
    return NO_PARTS;
  }

  const apart = distance(labelRoast, preferred);

  if (apart === 0) {
    return {
      points: [{ key: TRANSLATION_KEYS.scanPointRoastMatches, isAgainst: false }],
      uncertainties: [],
    };
  }

  if (apart <= ROAST_LEVEL_NEAR_DISTANCE) {
    return {
      points: [{ key: TRANSLATION_KEYS.scanPointRoastNear, isAgainst: false }],
      uncertainties: [],
    };
  }

  return {
    points: [{ key: TRANSLATION_KEYS.scanPointRoastDiffers, isAgainst: true }],
    uncertainties: [],
  };
};
