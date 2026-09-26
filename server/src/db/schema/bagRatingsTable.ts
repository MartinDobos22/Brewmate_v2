import type { BagRatingTag } from '@brewmate/shared';
import { index, jsonb, pgTable, smallint, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { bagImpressionEnum, bagRatingStageEnum } from './columnEnums.js';
import { coffeeBagsTable } from './coffeeBagsTable.js';
import { TABLE_NAMES } from './tableNames.js';
import { usersTable } from './usersTable.js';

const BAG_STAGE_INDEX_NAME = 'bag_ratings_bag_stage_idx';
const USER_UPDATED_INDEX_NAME = 'bag_ratings_user_updated_idx';
const NO_TAGS: BagRatingTag[] = [];

/**
 * What somebody thought of a bag halfway through it and once it was gone.
 *
 * One row per bag and stage, which the unique index makes a fact rather than
 * a habit: rating the same bag at the same stage again is changing your mind,
 * and the row is updated rather than joined by a second one. The taste event
 * each save writes is appended regardless - the trail keeps every answer, and
 * the fold reads only the latest for each bag and stage.
 *
 * The bag cascades, like everything that hangs off a bag: a rating of a coffee
 * that no longer exists is a rating of nothing. Archiving a bag keeps it, and
 * finishing a bag is exactly when the second rating is given.
 */
export const bagRatingsTable = pgTable(
  TABLE_NAMES.bagRatings,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    bagId: uuid('bag_id')
      .notNull()
      .references(() => coffeeBagsTable.id, { onDelete: 'cascade' }),
    stage: bagRatingStageEnum('stage').notNull(),
    stars: smallint('stars').notNull(),
    impression: bagImpressionEnum('impression'),
    tags: jsonb('tags').$type<BagRatingTag[]>().notNull().default(NO_TAGS),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(BAG_STAGE_INDEX_NAME).on(table.bagId, table.stage),
    index(USER_UPDATED_INDEX_NAME).on(table.userId, table.updatedAt.desc()),
  ],
);

export type BagRatingRow = typeof bagRatingsTable.$inferSelect;
export type NewBagRatingRow = typeof bagRatingsTable.$inferInsert;
