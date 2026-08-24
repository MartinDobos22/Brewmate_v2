import { AI_COST_PRECISION, AI_COST_SCALE } from '@brewmate/shared';
import { and, desc, eq, gte, sql } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { AiUsageLogRow, NewAiUsageLogRow } from '../../db/schema/aiUsageLogsTable.js';
import { aiUsageLogsTable } from '../../db/schema/aiUsageLogsTable.js';

import type { FunctionUsageTotals, UsageTotals } from './usageTotals.js';

export interface AiUsageListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

export interface AiUsageWindowFilter {
  readonly userId: string;
  readonly since: Date;
}

/**
 * The sum is cast back to the column's own type rather than left to whatever
 * `sum()` widens to, so PostgreSQL formats the decimal string and JavaScript
 * never sees the number. Turning an exact `numeric` into a float on the way
 * past would hand back precisely the rounding error the column exists to
 * avoid.
 */
const COST_TYPE = sql.raw(`numeric(${String(AI_COST_PRECISION)}, ${String(AI_COST_SCALE)})`);

const TOTALS_SELECTION = {
  calls: sql<string>`count(*)`,
  tokensIn: sql<string>`coalesce(sum(${aiUsageLogsTable.tokensIn}), 0)`,
  tokensOut: sql<string>`coalesce(sum(${aiUsageLogsTable.tokensOut}), 0)`,
  costEstimate: sql<string>`coalesce(sum(${aiUsageLogsTable.costEstimate}), 0)::${COST_TYPE}`,
};

/**
 * Everything `count()` and `sum()` return over the wire is text, including the
 * integers - which is a good thing here, because it means the only conversion
 * happens in one place instead of at every reader.
 */
interface TotalsRow {
  readonly calls: string;
  readonly tokensIn: string;
  readonly tokensOut: string;
  readonly costEstimate: string;
}

const toTotals = (row: TotalsRow): UsageTotals => ({
  calls: Number(row.calls),
  tokensIn: Number(row.tokensIn),
  tokensOut: Number(row.tokensOut),
  costEstimate: row.costEstimate,
});

export interface AiUsageRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: AiUsageListFilter): Promise<readonly AiUsageLogRow[]>;
  /** Called by the services that make the model calls, never by a client. */
  record(input: NewAiUsageLogRow): Promise<AiUsageLogRow>;
  /** What this account has spent since a moment - the whole of the limiter's input. */
  totalsSince(filter: AiUsageWindowFilter): Promise<UsageTotals>;
  /** The same slice, broken down by the feature that spent it. */
  totalsByFunctionSince(filter: AiUsageWindowFilter): Promise<readonly FunctionUsageTotals[]>;
}

export const createAiUsageRepository = (db: Database): AiUsageRepository => ({
  list: async ({ userId, limit, offset }) =>
    db
      .select()
      .from(aiUsageLogsTable)
      .where(eq(aiUsageLogsTable.userId, userId))
      .orderBy(desc(aiUsageLogsTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset),

  record: async (input) => requireRow(await db.insert(aiUsageLogsTable).values(input).returning()),

  totalsSince: async ({ userId, since }) =>
    toTotals(
      requireRow(
        await db
          .select(TOTALS_SELECTION)
          .from(aiUsageLogsTable)
          .where(and(eq(aiUsageLogsTable.userId, userId), gte(aiUsageLogsTable.createdAt, since))),
      ),
    ),

  totalsByFunctionSince: async ({ userId, since }) =>
    (
      await db
        .select({ functionName: aiUsageLogsTable.functionName, ...TOTALS_SELECTION })
        .from(aiUsageLogsTable)
        .where(and(eq(aiUsageLogsTable.userId, userId), gte(aiUsageLogsTable.createdAt, since)))
        .groupBy(aiUsageLogsTable.functionName)
        .orderBy(desc(TOTALS_SELECTION.costEstimate))
    ).map((row): FunctionUsageTotals => ({ functionName: row.functionName, ...toTotals(row) })),
});
