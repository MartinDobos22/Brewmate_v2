import type { RatioRange } from '@brewmate/shared';
import { boolean, index, integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';

import { brewMethodCategoryEnum, equipmentTypeEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';

const KEY_INDEX_NAME = 'brew_methods_key_unique_idx';
const ACTIVE_SORT_INDEX_NAME = 'brew_methods_active_sort_idx';
const FIRST_SORT_ORDER = 0;
const ACTIVE_BY_DEFAULT = true;

/**
 * Brewing methods, as data.
 *
 * Nothing in the application branches on `key`: everything that makes one
 * method behave differently from another is a column on this row. Adding a
 * method is an insert, not a release.
 *
 * Retired methods are flagged with `is_active` rather than deleted, because
 * recipes point at them and old recipes still have to mean something.
 */
export const brewMethodsTable = pgTable(
  TABLE_NAMES.brewMethods,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull(),
    nameSk: text('name_sk').notNull(),
    category: brewMethodCategoryEnum('category').notNull(),
    defaultRatioRange: jsonb('default_ratio_range').$type<RatioRange>().notNull(),
    requiresEquipmentType: equipmentTypeEnum('requires_equipment_type'),
    sortOrder: integer('sort_order').notNull().default(FIRST_SORT_ORDER),
    isActive: boolean('is_active').notNull().default(ACTIVE_BY_DEFAULT),
  },
  (table) => [
    uniqueIndex(KEY_INDEX_NAME).on(table.key),
    index(ACTIVE_SORT_INDEX_NAME).on(table.isActive, table.sortOrder),
  ],
);

export type BrewMethodRow = typeof brewMethodsTable.$inferSelect;
export type NewBrewMethodRow = typeof brewMethodsTable.$inferInsert;
