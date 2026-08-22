import type { BrewParams } from '@brewmate/shared';
import { isNotNull, isNull, sql } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { brewMethodsTable } from './brewMethodsTable.js';
import { coffeeBagsTable } from './coffeeBagsTable.js';
import { recipeSourceEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_CREATED_INDEX_NAME = 'recipes_user_created_idx';
const BAG_METHOD_INDEX_NAME = 'recipes_bag_method_idx';
const METHOD_INDEX_NAME = 'recipes_method_idx';
const PARENT_INDEX_NAME = 'recipes_parent_idx';
const PINNED_WITH_BAG_INDEX_NAME = 'recipes_pinned_bag_method_unique_idx';
const PINNED_WITHOUT_BAG_INDEX_NAME = 'recipes_pinned_method_unique_idx';
const NO_EQUIPMENT: readonly string[] = [];
const NOT_SAVED = false;
const NOT_PINNED = false;

/**
 * One way of brewing one coffee.
 *
 * A recipe belongs to the pair (bag, method) rather than to the coffee: the
 * same beans want a different treatment in a V60 than in an AeroPress, so a
 * pinned recipe is unique per pair.
 *
 * That takes two indexes, not one. `bag_id` is nullable for a quick brew with
 * beans that are not in the inventory, and SQL treats two NULLs as different
 * values - a single unique index over (user, bag, method) would happily let
 * somebody pin ten bagless V60 recipes. The second index covers exactly that
 * case. Pinning itself is done transactionally by the service; these indexes
 * are the backstop, not the mechanism.
 *
 * `parent_recipe_id` records where an adjustment came from and is set to null
 * on delete, so tidying up one ancestor cannot take a whole tree of
 * refinements with it.
 */
export const recipesTable = pgTable(
  TABLE_NAMES.recipes,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    bagId: uuid('bag_id').references(() => coffeeBagsTable.id, { onDelete: 'cascade' }),
    methodId: uuid('method_id')
      .notNull()
      .references(() => brewMethodsTable.id, { onDelete: 'restrict' }),
    equipmentIds: jsonb('equipment_ids').$type<readonly string[]>().notNull().default(NO_EQUIPMENT),
    params: jsonb('params').$type<BrewParams>().notNull(),
    rationale: text('rationale'),
    source: recipeSourceEnum('source').notNull(),
    parentRecipeId: uuid('parent_recipe_id').references((): AnyPgColumn => recipesTable.id, {
      onDelete: 'set null',
    }),
    isSaved: boolean('is_saved').notNull().default(NOT_SAVED),
    isPinned: boolean('is_pinned').notNull().default(NOT_PINNED),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt.desc()),
    index(BAG_METHOD_INDEX_NAME).on(table.bagId, table.methodId),
    index(METHOD_INDEX_NAME).on(table.methodId),
    index(PARENT_INDEX_NAME).on(table.parentRecipeId),
    uniqueIndex(PINNED_WITH_BAG_INDEX_NAME)
      .on(table.userId, table.bagId, table.methodId)
      .where(sql`${table.isPinned} and ${isNotNull(table.bagId)}`),
    uniqueIndex(PINNED_WITHOUT_BAG_INDEX_NAME)
      .on(table.userId, table.methodId)
      .where(sql`${table.isPinned} and ${isNull(table.bagId)}`),
  ],
);

export type RecipeRow = typeof recipesTable.$inferSelect;
export type NewRecipeRow = typeof recipesTable.$inferInsert;
