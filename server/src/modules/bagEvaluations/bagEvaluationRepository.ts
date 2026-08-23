import { and, desc, eq, sql, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { BagEvaluationRow, NewBagEvaluationRow } from '../../db/schema/bagEvaluationsTable.js';
import { bagEvaluationsTable } from '../../db/schema/bagEvaluationsTable.js';

export interface BagEvaluationListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

/** A coffee, as the two fields that identify it to a person. */
export interface CoffeeKey {
  readonly roasterKey: string;
  readonly nameKey: string;
}

export interface BagEvaluationRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: BagEvaluationListFilter): Promise<readonly BagEvaluationRow[]>;
  findById(id: string, userId: string): Promise<BagEvaluationRow | null>;
  /**
   * The most recent verdict this account was given about one coffee, so the
   * same bag is not weighed up twice.
   */
  findByCoffee(userId: string, coffee: CoffeeKey): Promise<BagEvaluationRow | null>;
  create(input: NewBagEvaluationRow): Promise<BagEvaluationRow>;
  updateById(
    id: string,
    userId: string,
    changes: Partial<NewBagEvaluationRow>,
  ): Promise<BagEvaluationRow | null>;
}

const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(bagEvaluationsTable.id, id), eq(bagEvaluationsTable.userId, userId));

/**
 * A label field out of the stored `parsed_data`, reduced to the form two
 * people would agree on.
 *
 * The same trim, the same lower-casing and the same collapsing of runs of
 * whitespace that `normalizeLabelKey` applies on the way in - "Cafe Sladko "
 * and "cafe  sladko" have to be one coffee here too, or the history would
 * offer a fresh verdict on a bag it already has one for.
 */
const normalizedLabelField = (field: string): SQL =>
  sql`regexp_replace(lower(btrim(${bagEvaluationsTable.parsedData} ->> ${field})), '\\s+', ' ', 'g')`;

const ROASTER_FIELD = 'roaster';
const NAME_FIELD = 'name';

export const createBagEvaluationRepository = (db: Database): BagEvaluationRepository => ({
  list: async ({ userId, limit, offset }) =>
    db
      .select()
      .from(bagEvaluationsTable)
      .where(eq(bagEvaluationsTable.userId, userId))
      .orderBy(desc(bagEvaluationsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset),

  findById: async (id, userId) =>
    firstRowOrNull(await db.select().from(bagEvaluationsTable).where(ownedBy(id, userId))),

  findByCoffee: async (userId, { roasterKey, nameKey }) =>
    firstRowOrNull(
      await db
        .select()
        .from(bagEvaluationsTable)
        .where(
          and(
            eq(bagEvaluationsTable.userId, userId),
            eq(normalizedLabelField(ROASTER_FIELD), roasterKey),
            eq(normalizedLabelField(NAME_FIELD), nameKey),
          ),
        )
        .orderBy(desc(bagEvaluationsTable.createdAt))
        .limit(EXTRA_ROW_FOR_HAS_MORE),
    ),

  create: async (input) =>
    requireRow(await db.insert(bagEvaluationsTable).values(input).returning()),

  updateById: async (id, userId, changes) =>
    firstRowOrNull(
      await db.update(bagEvaluationsTable).set(changes).where(ownedBy(id, userId)).returning(),
    ),
});
