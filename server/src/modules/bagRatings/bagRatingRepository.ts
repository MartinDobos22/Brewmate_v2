import { and, desc, eq, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { BagRatingRow, NewBagRatingRow } from '../../db/schema/bagRatingsTable.js';
import { bagRatingsTable } from '../../db/schema/bagRatingsTable.js';

export interface BagRatingListFilter {
  readonly userId: string;
  readonly bagId?: string;
  readonly limit: number;
  readonly offset: number;
}

export interface BagRatingRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: BagRatingListFilter): Promise<readonly BagRatingRow[]>;
  /** Writes the rating for this bag and stage, replacing one already there. */
  save(input: NewBagRatingRow): Promise<BagRatingRow>;
}

const filtered = ({ userId, bagId }: BagRatingListFilter): SQL | undefined =>
  bagId === undefined
    ? eq(bagRatingsTable.userId, userId)
    : and(eq(bagRatingsTable.userId, userId), eq(bagRatingsTable.bagId, bagId));

export const createBagRatingRepository = (db: Database): BagRatingRepository => ({
  list: async (filter) =>
    db
      .select()
      .from(bagRatingsTable)
      .where(filtered(filter))
      .orderBy(desc(bagRatingsTable.updatedAt))
      .limit(filter.limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(filter.offset),

  /**
   * An upsert on the bag and the stage, which is what the unique index says a
   * rating is. The caller has already checked the bag is the caller's own, so
   * the conflict can only ever be with this account's own earlier answer.
   */
  save: async (input) =>
    requireRow(
      await db
        .insert(bagRatingsTable)
        .values(input)
        .onConflictDoUpdate({
          target: [bagRatingsTable.bagId, bagRatingsTable.stage],
          set: {
            stars: input.stars,
            impression: input.impression ?? null,
            tags: input.tags,
            updatedAt: new Date(),
          },
        })
        .returning(),
    ),
});
