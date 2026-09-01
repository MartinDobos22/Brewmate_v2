import {
  TASTE_AXIS_NEUTRAL,
  type FlavorAffinities,
  type SourceWeights,
  type TasteAxisConfidence,
} from '@brewmate/shared';
import { integer, pgTable, real, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

import { milkUsageEnum, roastLevelEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const EMPTY_FLAVOR_AFFINITIES: FlavorAffinities = {};
const EMPTY_SOURCE_WEIGHTS: SourceWeights = {};
const NO_CONFIDENCE = 0;
const NO_AXIS_CONFIDENCE: TasteAxisConfidence = {
  acidity: NO_CONFIDENCE,
  sweetness: NO_CONFIDENCE,
  body: NO_CONFIDENCE,
  bitterness: NO_CONFIDENCE,
  intensity: NO_CONFIDENCE,
};
const NO_BREWS = 0;

/**
 * What Brewmate believes about one person's taste.
 *
 * The primary key is `user_id`, not a surrogate id: a profile is a singleton
 * per account, so this makes a second profile impossible rather than merely
 * unlikely, and "get or create" becomes one upsert.
 *
 * The row is a projection of `taste_profile_events`; replaying them rebuilds
 * exactly this. The axes are `real` because they are weighted averages, where
 * the last bit of precision is meaningless and a decimal round-trip through
 * strings would only get in the way.
 */
export const tasteProfilesTable = pgTable(TABLE_NAMES.tasteProfiles, {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  acidity: real('acidity').notNull().default(TASTE_AXIS_NEUTRAL),
  sweetness: real('sweetness').notNull().default(TASTE_AXIS_NEUTRAL),
  body: real('body').notNull().default(TASTE_AXIS_NEUTRAL),
  bitterness: real('bitterness').notNull().default(TASTE_AXIS_NEUTRAL),
  intensity: real('intensity').notNull().default(TASTE_AXIS_NEUTRAL),
  flavorAffinities: jsonb('flavor_affinities')
    .$type<FlavorAffinities>()
    .notNull()
    .default(EMPTY_FLAVOR_AFFINITIES),
  /** Reuses the roast level scale; null means no preference. */
  roastPreference: roastLevelEnum('roast_preference'),
  milkUsage: milkUsageEnum('milk_usage'),
  sourceWeights: jsonb('source_weights')
    .$type<SourceWeights>()
    .notNull()
    .default(EMPTY_SOURCE_WEIGHTS),
  /**
   * How much of each axis has been earned, beside the axis columns themselves.
   *
   * `jsonb` where the axes are real columns, and the difference is deliberate:
   * the axes are the thing the profile *is* - sorted, compared and read one at
   * a time - while this is metadata about them, in the same position
   * `source_weights` already holds. Five more `real` columns would double the
   * width of the table to say something nothing will ever query on.
   */
  axisConfidence: jsonb('axis_confidence')
    .$type<TasteAxisConfidence>()
    .notNull()
    .default(NO_AXIS_CONFIDENCE),
  confidenceLevel: real('confidence_level').notNull().default(NO_CONFIDENCE),
  brewCount: integer('brew_count').notNull().default(NO_BREWS),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type TasteProfileRow = typeof tasteProfilesTable.$inferSelect;
export type NewTasteProfileRow = typeof tasteProfilesTable.$inferInsert;
