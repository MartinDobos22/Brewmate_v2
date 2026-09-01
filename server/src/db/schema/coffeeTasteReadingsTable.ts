import type { CoffeeTasteReading } from '@brewmate/shared';
import { sql } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';

const LABEL_INDEX_NAME = 'coffee_taste_readings_label_key';

/**
 * What a model made of one coffee's label, kept so it is only ever made once.
 *
 * Belongs to nobody, exactly as `coffee_bag_parses` does and for the same
 * reason: the same coffee tastes the same for everybody, so what is stored
 * here is a statement about a product on a shelf and nothing about who
 * scanned it. There is no `user_id`, the row survives an account deletion, and
 * the second person to scan a popular bag gets the reading free.
 *
 * Keyed on the roaster and the name alone - no image hash, because this is
 * reached from a typed-in coffee as often as from a photograph, and a coffee
 * somebody wrote down by hand deserves the same answer as one they
 * photographed. A label whose roaster or name could not be read is not a key
 * at all: several unreadable bags are several different bags, which is what
 * the partial index says.
 *
 * Only the model's reading is cached, never the finished estimate. The tables
 * are re-folded on every read, so correcting a roast level on the form changes
 * the answer immediately instead of leaving a stale row behind - the same
 * reason a taste profile is a fold of its events rather than a patched row.
 */
export const coffeeTasteReadingsTable = pgTable(
  TABLE_NAMES.coffeeTasteReadings,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    roasterKey: text('roaster_key'),
    nameKey: text('name_key'),
    reading: jsonb('reading').$type<CoffeeTasteReading>().notNull(),
    model: text('model').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(LABEL_INDEX_NAME)
      .on(table.roasterKey, table.nameKey)
      .where(sql`${table.roasterKey} is not null and ${table.nameKey} is not null`),
  ],
);

export type CoffeeTasteReadingRow = typeof coffeeTasteReadingsTable.$inferSelect;
export type NewCoffeeTasteReadingRow = typeof coffeeTasteReadingsTable.$inferInsert;
