import type { BrewConstraints, PartialBrewParams } from '@brewmate/shared';
import { index, integer, jsonb, pgTable, real, timestamp, uuid } from 'drizzle-orm/pg-core';

import { coffeeBagsTable } from './coffeeBagsTable.js';
import { waterTypeEnum } from './columnEnums.js';
import { equipmentSetsTable } from './equipmentSetsTable.js';
import { recipesTable } from './recipesTable.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_CREATED_INDEX_NAME = 'brew_logs_user_created_idx';
const RECIPE_INDEX_NAME = 'brew_logs_recipe_idx';
const BAG_INDEX_NAME = 'brew_logs_bag_idx';
const EQUIPMENT_SET_INDEX_NAME = 'brew_logs_equipment_set_idx';
const NO_CONSTRAINTS: BrewConstraints = {};
const NO_ACTUAL_PARAMS: PartialBrewParams = {};
const FULL_LEARNING_WEIGHT = 1;

/**
 * A cup that was actually brewed. Everything here is a historical record and
 * nothing in it is derived at read time.
 *
 * `constraints` is what was true that morning and `profile_learning_weight` is
 * what the service priced those constraints at, once, on the way in. That is
 * the point of storing it: if the weight were computed on read, the day
 * somebody finally buys a kettle with temperature control, every disappointing
 * cup they ever made at a cabin would retroactively turn into evidence about
 * their taste.
 *
 * `recipe_id` cascades rather than restricts so that deleting an account
 * cannot deadlock against its own history; the service refuses to delete a
 * recipe that a log points at, which is where that rule belongs.
 */
export const brewLogsTable = pgTable(
  TABLE_NAMES.brewLogs,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipesTable.id, { onDelete: 'cascade' }),
    /** Null when the recipe was a quick brew outside the inventory. */
    bagId: uuid('bag_id').references(() => coffeeBagsTable.id, { onDelete: 'set null' }),
    equipmentSetId: uuid('equipment_set_id').references(() => equipmentSetsTable.id, {
      onDelete: 'set null',
    }),
    constraints: jsonb('constraints').$type<BrewConstraints>().notNull().default(NO_CONSTRAINTS),
    actualParams: jsonb('actual_params')
      .$type<PartialBrewParams>()
      .notNull()
      .default(NO_ACTUAL_PARAMS),
    waterType: waterTypeEnum('water_type').notNull(),
    durationSeconds: integer('duration_seconds'),
    profileLearningWeight: real('profile_learning_weight').notNull().default(FULL_LEARNING_WEIGHT),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt.desc()),
    index(RECIPE_INDEX_NAME).on(table.recipeId),
    index(BAG_INDEX_NAME).on(table.bagId),
    index(EQUIPMENT_SET_INDEX_NAME).on(table.equipmentSetId),
  ],
);

export type BrewLogRow = typeof brewLogsTable.$inferSelect;
export type NewBrewLogRow = typeof brewLogsTable.$inferInsert;
