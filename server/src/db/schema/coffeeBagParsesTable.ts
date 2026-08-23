import type { ParsedBagFields } from '@brewmate/shared';
import { sql } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';

const IMAGE_HASH_INDEX_NAME = 'coffee_bag_parses_image_hash_key';
const LABEL_INDEX_NAME = 'coffee_bag_parses_label_key';

/**
 * A coffee bag label, once it has been read.
 *
 * Two keys onto the same row, because there are two ways for a reading to be
 * repeated. `image_hash` catches the same photograph - a retry on a bad signal,
 * or the app asking twice. `(roaster_key, name_key)` catches the same coffee
 * photographed by somebody else, in another shop, from another angle.
 *
 * Deliberately not owned by anybody: there is no `user_id`, the row survives
 * an account deletion, and it is shared across accounts the way the grinder
 * catalogue is. What is stored is a printed label - public information about a
 * product on a shelf - and nothing about who photographed it. A cache scoped
 * to one person would answer for the roaster-and-name pair almost never, which
 * is the case it exists for.
 *
 * The label keys are normalised (trimmed, lower-cased) so "Cafe Sladko" and
 * "cafe sladko  " are one entry, and the partial unique index leaves rows
 * whose label could not be read out of that rule entirely - several unreadable
 * bags are several different bags.
 */
export const coffeeBagParsesTable = pgTable(
  TABLE_NAMES.coffeeBagParses,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Content hash of the photograph's bytes, hex encoded. */
    imageHash: text('image_hash').notNull(),
    roasterKey: text('roaster_key'),
    nameKey: text('name_key'),
    fields: jsonb('fields').$type<ParsedBagFields>().notNull(),
    model: text('model').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(IMAGE_HASH_INDEX_NAME).on(table.imageHash),
    uniqueIndex(LABEL_INDEX_NAME)
      .on(table.roasterKey, table.nameKey)
      .where(sql`${table.roasterKey} is not null and ${table.nameKey} is not null`),
  ],
);

export type CoffeeBagParseRow = typeof coffeeBagParsesTable.$inferSelect;
export type NewCoffeeBagParseRow = typeof coffeeBagParsesTable.$inferInsert;
