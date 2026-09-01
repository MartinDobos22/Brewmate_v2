import { MATCH_BANDS, MATCH_DIRECTIONS, type AxisMatch, type CoffeeMatch } from '@brewmate/shared';

import { TRANSLATION_KEYS } from '../../../i18n';
import { MATCH_ALIGNED_KEYS, MATCH_DIRECTION_KEYS } from '../../coffeeTaste/constants';
import { BAG_SCAN_FIELDS, OFFLINE_MATCH_REASONS } from '../constants/bagScan';

import type { BagVerdictParts } from './bagVerdictTypes';

const NOTHING = 0;

/**
 * Nothing to say about the fit, and the reason why said out loud.
 *
 * An absent argument and an argument that was never possible look identical on
 * the card unless the second one names itself, and "primálo spoločných údajov"
 * is the difference between a verdict that is quiet and one that is broken.
 */
const NOT_COMPARABLE: BagVerdictParts = {
  points: [],
  uncertainties: [
    { field: BAG_SCAN_FIELDS.tasteProfile, reasonKey: TRANSLATION_KEYS.scanReasonTooFewAxes },
  ],
};

/**
 * What the five-axis comparison says, as verdict points.
 *
 * The offline verdict used to compare two things: the roast level against a
 * stated roast preference, and the printed notes against a handful of flavour
 * tags. Both are real, and both leave out the thing the app actually knows
 * most about - where this coffee sits on the five axes the person is described
 * on, and how much of that either side has earned. This is that comparison,
 * turned into the same shape the other two rules already produce.
 *
 * It speaks only when the match itself says it may. `band` is `unknown`
 * wherever fewer than two axes could be compared, and the rule behind that is
 * the matcher's own: one axis is an anecdote, because a coffee whose acidity
 * happens to suit somebody says nothing about whether they will enjoy drinking
 * it. Reading only `comparable.length` let exactly that anecdote through - and
 * let it through on the offline path, which is the one used in a shop, on one
 * bar of signal, by the newest accounts, where the app has least standing to
 * sound certain. The server's own prompt has always applied both conditions;
 * this is the same rule on the side that needed it more.
 *
 * Only the top few reasons are kept. The matcher orders them by how much each
 * one says, and a verdict listing all five axes is one nobody reads to the
 * end - the two or three that carry the argument are the argument.
 */
export const readAxisFit = (match: CoffeeMatch): BagVerdictParts => {
  if (match.band === MATCH_BANDS.unknown) {
    return NOT_COMPARABLE;
  }

  return {
    points: match.comparable
      .slice(NOTHING, OFFLINE_MATCH_REASONS)
      .map((axis: AxisMatch) =>
        axis.direction === MATCH_DIRECTIONS.aligned
          ? { key: MATCH_ALIGNED_KEYS[axis.axis], isAgainst: false }
          : { key: MATCH_DIRECTION_KEYS[axis.axis][axis.direction], isAgainst: true },
      ),
    uncertainties: [],
  };
};
