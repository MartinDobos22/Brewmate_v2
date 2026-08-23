import { RESTING_DAYS } from '../../../constants/brewing';
import { MILLISECONDS_PER_DAY } from '../../../constants/time';
import { TRANSLATION_KEYS } from '../../../i18n';
import { BAG_SCAN_FIELDS } from '../constants/bagScan';

import type { BagVerdictParts } from './bagVerdictTypes';

/**
 * How long ago a bag was roasted, and what that means for the cup.
 *
 * The one thing in a verdict that is not about anybody's taste: coffee that
 * was roasted yesterday is still degassing whoever is drinking it, and coffee
 * from two months ago is flat whoever is drinking it. Which is exactly why it
 * is worth saying even when the profile knows nothing.
 */
export const readFreshness = (roastDate: string | null | undefined, now: Date): BagVerdictParts => {
  if (roastDate === null || roastDate === undefined) {
    return {
      points: [],
      uncertainties: [
        { field: BAG_SCAN_FIELDS.roastDate, reasonKey: TRANSLATION_KEYS.scanReasonNoRoastDate },
      ],
    };
  }

  const days = Math.floor((now.getTime() - Date.parse(roastDate)) / MILLISECONDS_PER_DAY);

  if (days < RESTING_DAYS.min) {
    return {
      points: [{ key: TRANSLATION_KEYS.scanPointTooFresh, isAgainst: false }],
      uncertainties: [],
    };
  }

  if (days > RESTING_DAYS.max) {
    return {
      points: [{ key: TRANSLATION_KEYS.scanPointOld, isAgainst: true }],
      uncertainties: [],
    };
  }

  return {
    points: [{ key: TRANSLATION_KEYS.scanPointRested, isAgainst: false }],
    uncertainties: [],
  };
};
