import { GRINDER_SEARCH_TERMS_MAX, type GrinderTypicalUse } from '@brewmate/shared';
import { and, asc, eq, or, sql, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { GrinderRow, NewGrinderRow } from '../../db/schema/grindersCatalogTable.js';
import { grindersCatalogTable } from '../../db/schema/grindersCatalogTable.js';
import { splitSearchTerms } from '../../db/sql/splitSearchTerms.js';
import { toContainsPattern } from '../../db/sql/toContainsPattern.js';

const VERIFIED = true;

export interface GrinderListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
  readonly typicalUse?: GrinderTypicalUse;
  readonly verifiedOnly?: boolean;
  /** Free text, matched word by word against the brand and the model. */
  readonly search?: string;
}

export interface GrinderRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: GrinderListFilter): Promise<readonly GrinderRow[]>;
  /** Resolves only what this caller is allowed to see. */
  findVisible(id: string, userId: string): Promise<GrinderRow | null>;
  findVerifiedByModel(brand: string, model: string): Promise<GrinderRow | null>;
  create(input: NewGrinderRow): Promise<GrinderRow>;
  updateById(id: string, changes: Partial<NewGrinderRow>): Promise<GrinderRow | null>;
}

/**
 * A verified entry belongs to everybody; an unverified one is only offered to
 * the person who contributed it. Without that, one typo would sit in every
 * user's picker until somebody noticed.
 */
const visibleTo = (userId: string): SQL | undefined =>
  or(
    eq(grindersCatalogTable.isVerified, VERIFIED),
    eq(grindersCatalogTable.createdByUserId, userId),
  );

/** The searchable text of a row: "Comandante C40 MK4", not two columns. */
const searchableName = sql`${grindersCatalogTable.brand} || ' ' || ${grindersCatalogTable.model}`;

/**
 * Every word has to appear somewhere in the brand and model together, so a
 * half-remembered "1zpresso pro" still finds the JX-Pro, and the order the
 * words were typed in does not matter.
 */
const matchesSearch = (search: string): SQL | undefined =>
  and(
    ...splitSearchTerms(search, GRINDER_SEARCH_TERMS_MAX).map(
      (term: string): SQL => sql`${searchableName} ilike ${toContainsPattern(term)}`,
    ),
  );

export const createGrinderRepository = (db: Database): GrinderRepository => ({
  list: async ({
    userId,
    limit,
    offset,
    typicalUse,
    verifiedOnly,
    search,
  }): Promise<readonly GrinderRow[]> => {
    const conditions: (SQL | undefined)[] = [
      verifiedOnly === true ? eq(grindersCatalogTable.isVerified, VERIFIED) : visibleTo(userId),
    ];

    if (typicalUse !== undefined) {
      conditions.push(eq(grindersCatalogTable.typicalUse, typicalUse));
    }

    if (search !== undefined) {
      conditions.push(matchesSearch(search));
    }

    return db
      .select()
      .from(grindersCatalogTable)
      .where(and(...conditions))
      .orderBy(asc(grindersCatalogTable.brand), asc(grindersCatalogTable.model))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset);
  },

  findVisible: async (id, userId) =>
    firstRowOrNull(
      await db
        .select()
        .from(grindersCatalogTable)
        .where(and(eq(grindersCatalogTable.id, id), visibleTo(userId))),
    ),

  findVerifiedByModel: async (brand, model) =>
    firstRowOrNull(
      await db
        .select()
        .from(grindersCatalogTable)
        .where(
          and(
            sql`lower(${grindersCatalogTable.brand}) = lower(${brand})`,
            sql`lower(${grindersCatalogTable.model}) = lower(${model})`,
            eq(grindersCatalogTable.isVerified, VERIFIED),
          ),
        ),
    ),

  create: async (input) =>
    requireRow(await db.insert(grindersCatalogTable).values(input).returning()),

  updateById: async (id, changes) =>
    firstRowOrNull(
      await db
        .update(grindersCatalogTable)
        .set(changes)
        .where(eq(grindersCatalogTable.id, id))
        .returning(),
    ),
});
