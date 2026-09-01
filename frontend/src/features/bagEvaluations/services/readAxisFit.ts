import { MATCH_DIRECTIONS, type AxisMatch, type CoffeeMatch } from '@brewmate/shared';

import { MATCH_ALIGNED_KEYS, MATCH_DIRECTION_KEYS } from '../../coffeeTaste/constants';
import { OFFLINE_MATCH_REASONS } from '../constants/bagScan';

import type { BagVerdictParts } from './bagVerdictTypes';

const NO_PARTS: BagVerdictParts = { points: [], uncertainties: [] };
const NOTHING = 0;

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
 * Only the top few reasons are kept. The matcher orders them by how much each
 * one says, and a verdict listing all five axes is one nobody reads to the
 * end - the two or three that carry the argument are the argument.
 */
export const readAxisFit = (match: CoffeeMatch): BagVerdictParts => {
  if (match.comparable.length === NOTHING) {
    return NO_PARTS;
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
