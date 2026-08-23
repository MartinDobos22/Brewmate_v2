import type { ParsedBagData, TasteProfile } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../i18n';
import { CONFIDENCE_LEVELS } from '../../tasteProfile/constants';
import { resolveConfidenceLevel } from '../../tasteProfile/services';
import { BAG_SCAN_FIELDS, BAG_VERDICT_LEVELS, type BagVerdictLevel } from '../constants/bagScan';

import type { BagUncertainty, BagVerdictParts, BagVerdictPoint } from './bagVerdictTypes';
import { readFlavorFit } from './readFlavorFit';
import { readFreshness } from './readFreshness';
import { readRoastFit } from './readRoastFit';

const NOTHING = 0;
const NO_NOTES: readonly string[] = [];

export interface BagVerdict {
  readonly level: BagVerdictLevel;
  readonly points: readonly BagVerdictPoint[];
  readonly uncertainties: readonly BagUncertainty[];
}

const isAgainst = (point: BagVerdictPoint): boolean => point.isAgainst;

const resolveLevel = (points: readonly BagVerdictPoint[]): BagVerdictLevel => {
  if (points.length === NOTHING) {
    return BAG_VERDICT_LEVELS.unknown;
  }

  return points.some(isAgainst) ? BAG_VERDICT_LEVELS.mixed : BAG_VERDICT_LEVELS.fits;
};

/**
 * Should this bag come home?
 *
 * Read by three small rules rather than by a model: the roast against what
 * this person reaches for, the printed notes against what they like, and the
 * roast date against the calendar. Deterministic, offline, and - the part that
 * matters in a shop - showable in full, so the answer can be argued with.
 *
 * A profile that has learnt nothing yet produces no taste argument at all,
 * only the freshness one. The verdict then says it cannot judge, which is the
 * true answer: this is the screen a brand-new user reaches first, and it must
 * not repay that by inventing an opinion about them.
 */
export const evaluateBag = (
  parsed: ParsedBagData,
  profile: TasteProfile,
  now: Date = new Date(),
): BagVerdict => {
  const knowsTaste = resolveConfidenceLevel(profile.confidenceLevel) !== CONFIDENCE_LEVELS.none;
  const taste: readonly BagVerdictParts[] = knowsTaste
    ? [
        readRoastFit(parsed.roastLevel ?? undefined, profile.roastPreference),
        readFlavorFit(parsed.tastingNotes ?? NO_NOTES, profile.flavorAffinities),
      ]
    : [];
  const parts = [...taste, readFreshness(parsed.roastDate, now)];
  const points = parts.flatMap((part: BagVerdictParts): readonly BagVerdictPoint[] => part.points);

  return {
    points,
    level: resolveLevel(points),
    uncertainties: [
      ...parts.flatMap((part: BagVerdictParts): readonly BagUncertainty[] => part.uncertainties),
      ...(knowsTaste
        ? []
        : [
            {
              field: BAG_SCAN_FIELDS.tasteProfile,
              reasonKey: TRANSLATION_KEYS.scanReasonNoProfile,
            },
          ]),
    ],
  };
};
