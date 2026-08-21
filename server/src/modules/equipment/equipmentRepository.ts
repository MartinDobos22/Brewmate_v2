import type { EquipmentType } from '@brewmate/shared';
import { and, asc, eq, inArray, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { EquipmentRow, NewEquipmentRow } from '../../db/schema/equipmentTable.js';
import { equipmentTable } from '../../db/schema/equipmentTable.js';

const ACTIVE = true;
const NO_ROWS = 0;

export interface EquipmentListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
  readonly type?: EquipmentType;
  readonly activeOnly?: boolean;
}

export interface EquipmentRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: EquipmentListFilter): Promise<readonly EquipmentRow[]>;
  findById(id: string, userId: string): Promise<EquipmentRow | null>;
  /** Which of these ids the user actually owns - the check a foreign key would do. */
  findOwnedIds(ids: readonly string[], userId: string): Promise<readonly string[]>;
  create(input: NewEquipmentRow): Promise<EquipmentRow>;
  updateById(
    id: string,
    userId: string,
    changes: Partial<NewEquipmentRow>,
  ): Promise<EquipmentRow | null>;
  deleteById(id: string, userId: string): Promise<boolean>;
}

/**
 * Every query is scoped in the WHERE clause rather than checked afterwards, so
 * a missing row and someone else's row are indistinguishable from outside.
 */
const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(equipmentTable.id, id), eq(equipmentTable.userId, userId));

export const createEquipmentRepository = (db: Database): EquipmentRepository => ({
  list: async ({
    userId,
    limit,
    offset,
    type,
    activeOnly,
  }): Promise<readonly EquipmentRow[]> => {
    const conditions: (SQL | undefined)[] = [eq(equipmentTable.userId, userId)];

    if (type !== undefined) {
      conditions.push(eq(equipmentTable.type, type));
    }

    if (activeOnly === true) {
      conditions.push(eq(equipmentTable.isActive, ACTIVE));
    }

    return db
      .select()
      .from(equipmentTable)
      .where(and(...conditions))
      .orderBy(asc(equipmentTable.type), asc(equipmentTable.createdAt))
      .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
      .offset(offset);
  },

  findById: async (id, userId) =>
    firstRowOrNull(await db.select().from(equipmentTable).where(ownedBy(id, userId))),

  findOwnedIds: async (ids, userId): Promise<readonly string[]> => {
    if (ids.length === NO_ROWS) {
      return [];
    }

    const rows = await db
      .select({ id: equipmentTable.id })
      .from(equipmentTable)
      .where(and(eq(equipmentTable.userId, userId), inArray(equipmentTable.id, [...ids])));

    return rows.map((row: { id: string }): string => row.id);
  },

  create: async (input) => requireRow(await db.insert(equipmentTable).values(input).returning()),

  updateById: async (id, userId, changes) =>
    firstRowOrNull(
      await db
        .update(equipmentTable)
        .set({ ...changes, updatedAt: new Date() })
        .where(ownedBy(id, userId))
        .returning(),
    ),

  deleteById: async (id, userId) =>
    (await db.delete(equipmentTable).where(ownedBy(id, userId)).returning()).length > NO_ROWS,
});
