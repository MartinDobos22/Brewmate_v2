import { TASTE_AXIS_NAMES, type TasteAxisName, type TasteProfileSource } from '@brewmate/shared';

import type { TasteProfileRow } from '../../db/schema/tasteProfilesTable.js';

import { TASTE_SOURCES } from './constants/reducerWeights.js';

const NOTHING = 0;

const isTasteSource = (source: string): boolean =>
  TASTE_SOURCES.some((taste: TasteProfileSource): boolean => taste === source);

/**
 * Evidence about the profile as a whole is the sum of the evidence about its
 * axes, so one cannot be positive while all five are zero.
 */
const hasUnearnedConfidence = (row: TasteProfileRow): boolean =>
  row.confidenceLevel > NOTHING &&
  TASTE_AXIS_NAMES.every((axis: TasteAxisName): boolean => row.axisConfidence[axis] === NOTHING);

/**
 * A share of the evidence credited to a source the fold no longer reads.
 *
 * The fold stopped listening to brews, and every profile written before that
 * carries their share in `sourceWeights` - which the current fold only ever
 * writes for a taste source.
 */
const creditsForeignSource = (row: TasteProfileRow): boolean =>
  Object.keys(row.sourceWeights).some((source: string): boolean => !isTasteSource(source));

/**
 * Whether a stored profile was written by a reducer that no longer exists.
 *
 * The row is a projection of the audit trail, so it is only ever as current as
 * the fold that produced it - and the fold has changed since some of these
 * rows were written. Each change left behind a state the current fold cannot
 * produce, and that impossibility is the whole test. Accounts that answered a
 * questionnaire before per-axis evidence existed carry a real confidence over
 * five axes that all claim to have been earned from nothing; accounts that
 * described a brew before the profile stopped listening to brews carry a share
 * of the evidence credited to the chat.
 *
 * A migration can add a column but cannot replay anybody's events, and
 * rebuilding on the next read is both correct and free - the trail is the
 * truth, and folding it is what `get` does for a missing row anyway.
 */
export const isStaleProjection = (row: TasteProfileRow): boolean =>
  hasUnearnedConfidence(row) || creditsForeignSource(row);
