import type { MicronCalibration } from '@brewmate/shared';
import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { grinderTypicalUseEnum, grinderUnitTypeEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const VERIFIED_MODEL_INDEX_NAME = 'grinders_catalog_verified_model_unique_idx';
const CREATED_BY_INDEX_NAME = 'grinders_catalog_created_by_idx';
const UNVERIFIED_BY_DEFAULT = false;

/**
 * The shared grinder catalogue, which users may extend.
 *
 * `created_by_user_id` is set to null rather than cascaded when that person
 * deletes their account. The entry itself is not personal data - it is a brand
 * and a model that other people's equipment points at - and cascading it would
 * quietly break somebody else's inventory. Only the attribution goes.
 *
 * The unique index covers verified entries only: two people may each add their
 * own unverified guess at the same grinder without colliding, but the
 * catalogue everyone sees holds one row per model.
 */
export const grindersCatalogTable = pgTable(
  TABLE_NAMES.grindersCatalog,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    unitType: grinderUnitTypeEnum('unit_type').notNull(),
    minSetting: real('min_setting').notNull(),
    maxSetting: real('max_setting').notNull(),
    step: real('step').notNull(),
    /** Measured pairs of setting and microns; everything between is interpolated. */
    micronCalibration: jsonb('micron_calibration').$type<MicronCalibration>(),
    typicalUse: grinderTypicalUseEnum('typical_use').notNull(),
    isVerified: boolean('is_verified').notNull().default(UNVERIFIED_BY_DEFAULT),
    createdByUserId: uuid('created_by_user_id').references(() => usersTable.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(VERIFIED_MODEL_INDEX_NAME)
      .on(sql`lower(${table.brand})`, sql`lower(${table.model})`)
      .where(sql`${table.isVerified}`),
    index(CREATED_BY_INDEX_NAME).on(table.createdByUserId),
  ],
);

export type GrinderRow = typeof grindersCatalogTable.$inferSelect;
export type NewGrinderRow = typeof grindersCatalogTable.$inferInsert;
