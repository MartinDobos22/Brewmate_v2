import type { BrewConstraints } from '@brewmate/shared';
import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_NAME_INDEX_NAME = 'equipment_sets_user_name_unique_idx';
const SINGLE_DEFAULT_INDEX_NAME = 'equipment_sets_single_default_unique_idx';
const USER_SORT_INDEX_NAME = 'equipment_sets_user_sort_idx';
const NO_EQUIPMENT: readonly string[] = [];
const NO_CONSTRAINTS: BrewConstraints = {};
const FIRST_SORT_ORDER = 0;
const NOT_DEFAULT = false;

/**
 * A named combination of gear the user already owns - "Domov", "Chata".
 * It introduces no new equipment; it is a saved selection.
 *
 * `equipment_ids` is a `jsonb` array rather than a join table: a set is always
 * read whole, its order carries meaning, and replacing it is a single write.
 * The cost is that the database cannot enforce those references, so the
 * service does it instead - every id must exist and belong to the caller, and
 * deleting a piece of gear prunes it out of that user's sets. That check is
 * the substitute for the missing foreign key, and it is the only place in this
 * schema where code stands in for the database.
 *
 * The partial unique index gives every user at most one default set.
 */
export const equipmentSetsTable = pgTable(
  TABLE_NAMES.equipmentSets,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    equipmentIds: jsonb('equipment_ids').$type<readonly string[]>().notNull().default(NO_EQUIPMENT),
    /** What this place is usually missing, so a brew logged there starts honest. */
    defaultConstraints: jsonb('default_constraints')
      .$type<BrewConstraints>()
      .notNull()
      .default(NO_CONSTRAINTS),
    isDefault: boolean('is_default').notNull().default(NOT_DEFAULT),
    sortOrder: integer('sort_order').notNull().default(FIRST_SORT_ORDER),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(USER_NAME_INDEX_NAME).on(table.userId, table.name),
    uniqueIndex(SINGLE_DEFAULT_INDEX_NAME)
      .on(table.userId)
      .where(sql`${table.isDefault}`),
    index(USER_SORT_INDEX_NAME).on(table.userId, table.sortOrder),
  ],
);

export type EquipmentSetRow = typeof equipmentSetsTable.$inferSelect;
export type NewEquipmentSetRow = typeof equipmentSetsTable.$inferInsert;
