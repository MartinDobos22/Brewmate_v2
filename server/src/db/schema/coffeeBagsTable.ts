import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { roastLevelEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const USER_ARCHIVED_INDEX_NAME = 'coffee_bags_user_archived_idx';
const USER_CREATED_INDEX_NAME = 'coffee_bags_user_created_idx';
const NO_TASTING_NOTES: readonly string[] = [];
const NOT_ARCHIVED = false;

/**
 * A bag of coffee.
 *
 * `roast_date` is a `date` and not a timestamp on purpose: a roast date has no
 * time and no timezone. Stored as `timestamptz` it would shift when read from
 * another zone, and the resting window - which is the whole reason the date is
 * here - would come out a day wrong.
 *
 * Bags are archived, never deleted through the API: brew logs point at them,
 * and a finished bag is the most valuable history this app accumulates.
 */
export const coffeeBagsTable = pgTable(
  TABLE_NAMES.coffeeBags,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    roaster: text('roaster'),
    name: text('name').notNull(),
    originCountry: text('origin_country'),
    region: text('region'),
    farm: text('farm'),
    variety: text('variety'),
    /** Free text: processing is an open vocabulary and no code branches on it. */
    process: text('process'),
    roastLevel: roastLevelEnum('roast_level'),
    roastDate: date('roast_date'),
    altitude: integer('altitude'),
    tastingNotes: jsonb('tasting_notes')
      .$type<readonly string[]>()
      .notNull()
      .default(NO_TASTING_NOTES),
    weightGrams: real('weight_grams'),
    remainingGrams: real('remaining_grams'),
    imageUrl: text('image_url'),
    isArchived: boolean('is_archived').notNull().default(NOT_ARCHIVED),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index(USER_ARCHIVED_INDEX_NAME).on(table.userId, table.isArchived),
    index(USER_CREATED_INDEX_NAME).on(table.userId, table.createdAt.desc()),
  ],
);

export type CoffeeBagRow = typeof coffeeBagsTable.$inferSelect;
export type NewCoffeeBagRow = typeof coffeeBagsTable.$inferInsert;
