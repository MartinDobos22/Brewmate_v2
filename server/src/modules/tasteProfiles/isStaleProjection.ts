import { TASTE_AXIS_NAMES, type TasteAxisName } from '@brewmate/shared';

import type { TasteProfileRow } from '../../db/schema/tasteProfilesTable.js';

const NOTHING = 0;

/**
 * Whether a stored profile was written by a reducer that no longer exists.
 *
 * The row is a projection of the audit trail, so it is only ever as current as
 * the fold that produced it - and the fold has changed since some of these
 * rows were written. Every account that had answered a questionnaire before
 * per-axis evidence existed carries a real confidence over five axes that all
 * claim to have been earned from nothing, which is a state the current fold
 * cannot produce: evidence about the profile as a whole is the sum of the
 * evidence about its axes, so one cannot be positive while all five are zero.
 *
 * That impossibility is the whole test. A migration can add the column but
 * cannot replay anybody's events, and rebuilding on the next read is both
 * correct and free - the trail is the truth, and folding it is what `get` does
 * for a missing row anyway.
 */
export const isStaleProjection = (row: TasteProfileRow): boolean =>
  row.confidenceLevel > NOTHING &&
  TASTE_AXIS_NAMES.every((axis: TasteAxisName): boolean => row.axisConfidence[axis] === NOTHING);
