import { TASTE_PROFILE_SOURCES } from '@brewmate/shared';
import { and, asc, eq, notExists, sql } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import type { CoffeeBagRow } from '../../db/schema/coffeeBagsTable.js';
import { coffeeBagsTable } from '../../db/schema/coffeeBagsTable.js';
import { tasteProfileEventsTable } from '../../db/schema/tasteProfileEventsTable.js';

export interface PurchaseBackfillRepository {
  /**
   * Every bag, finished ones included, that no purchase event points at.
   *
   * Across every account, because this is run once by whoever deploys the
   * change, not by a person on their phone.
   */
  listBagsWithoutPurchase(): Promise<readonly CoffeeBagRow[]>;
}

export const createPurchaseBackfillRepository = (db: Database): PurchaseBackfillRepository => ({
  listBagsWithoutPurchase: async () =>
    db
      .select()
      .from(coffeeBagsTable)
      .where(
        notExists(
          db
            .select({ id: tasteProfileEventsTable.id })
            .from(tasteProfileEventsTable)
            .where(
              and(
                eq(tasteProfileEventsTable.userId, coffeeBagsTable.userId),
                eq(tasteProfileEventsTable.source, TASTE_PROFILE_SOURCES.purchase),
                eq(tasteProfileEventsTable.sourceRef, sql`${coffeeBagsTable.id}::text`),
              ),
            ),
        ),
      )
      .orderBy(asc(coffeeBagsTable.createdAt)),
});
