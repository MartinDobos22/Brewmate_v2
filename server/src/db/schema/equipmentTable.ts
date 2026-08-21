import type { JsonObject } from '@brewmate/shared';
import { boolean, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { equipmentTypeEnum } from './columnEnums.js';
import { grindersCatalogTable } from './grindersCatalogTable.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_TYPE_INDEX_NAME = 'equipment_user_type_idx';
const CATALOG_GRINDER_INDEX_NAME = 'equipment_catalog_grinder_idx';
const EMPTY_PARAMS: JsonObject = {};
const ACTIVE_BY_DEFAULT = true;

/**
 * One piece of gear somebody owns.
 *
 * The link to the grinder catalogue is what makes a setting translatable into
 * microns, and it is nullable because gear bought second hand still has to be
 * usable before anybody has catalogued it.
 *
 * `params` is `jsonb` because a kettle and a scale share no properties at all;
 * a column per property would produce a table that is mostly nulls.
 */
export const equipmentTable = pgTable(
  TABLE_NAMES.equipment,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    type: equipmentTypeEnum('type').notNull(),
    catalogGrinderId: uuid('catalog_grinder_id').references(() => grindersCatalogTable.id, {
      onDelete: 'set null',
    }),
    brand: text('brand'),
    model: text('model'),
    params: jsonb('params').$type<JsonObject>().notNull().default(EMPTY_PARAMS),
    isActive: boolean('is_active').notNull().default(ACTIVE_BY_DEFAULT),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_TYPE_INDEX_NAME).on(table.userId, table.type),
    index(CATALOG_GRINDER_INDEX_NAME).on(table.catalogGrinderId),
  ],
);

export type EquipmentRow = typeof equipmentTable.$inferSelect;
export type NewEquipmentRow = typeof equipmentTable.$inferInsert;
