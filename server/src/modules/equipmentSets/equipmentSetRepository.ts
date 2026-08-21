import { and, asc, eq, type SQL } from 'drizzle-orm';

import { EXTRA_ROW_FOR_HAS_MORE } from '../../constants/pagination.js';
import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { EquipmentSetRow, NewEquipmentSetRow } from '../../db/schema/equipmentSetsTable.js';
import { equipmentSetsTable } from '../../db/schema/equipmentSetsTable.js';

const NO_ROWS = 0;
const NOT_DEFAULT = false;

export interface EquipmentSetListFilter {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

export interface EquipmentSetRepository {
  /** Reads one row beyond the page, so the caller can answer `hasMore`. */
  list(filter: EquipmentSetListFilter): Promise<readonly EquipmentSetRow[]>;
  listAll(userId: string): Promise<readonly EquipmentSetRow[]>;
  findById(id: string, userId: string): Promise<EquipmentSetRow | null>;
  create(input: NewEquipmentSetRow): Promise<EquipmentSetRow>;
  updateById(
    id: string,
    userId: string,
    changes: Partial<NewEquipmentSetRow>,
  ): Promise<EquipmentSetRow | null>;
  deleteById(id: string, userId: string): Promise<boolean>;
  /** Clears every other default and marks this one, in a single transaction. */
  makeDefault(id: string, userId: string): Promise<EquipmentSetRow | null>;
  /** Removes a piece of equipment from every set that names it. */
  pruneEquipmentId(equipmentId: string, userId: string): Promise<void>;
}

const ownedBy = (id: string, userId: string): SQL | undefined =>
  and(eq(equipmentSetsTable.id, id), eq(equipmentSetsTable.userId, userId));

export const createEquipmentSetRepository = (db: Database): EquipmentSetRepository => {
  const listAll = async (userId: string): Promise<readonly EquipmentSetRow[]> =>
    db
      .select()
      .from(equipmentSetsTable)
      .where(eq(equipmentSetsTable.userId, userId))
      .orderBy(asc(equipmentSetsTable.sortOrder), asc(equipmentSetsTable.name));

  return {
    listAll,

    list: async ({ userId, limit, offset }) =>
      db
        .select()
        .from(equipmentSetsTable)
        .where(eq(equipmentSetsTable.userId, userId))
        .orderBy(asc(equipmentSetsTable.sortOrder), asc(equipmentSetsTable.name))
        .limit(limit + EXTRA_ROW_FOR_HAS_MORE)
        .offset(offset),

    findById: async (id, userId) =>
      firstRowOrNull(await db.select().from(equipmentSetsTable).where(ownedBy(id, userId))),

    create: async (input) =>
      requireRow(await db.insert(equipmentSetsTable).values(input).returning()),

    updateById: async (id, userId, changes) =>
      firstRowOrNull(
        await db
          .update(equipmentSetsTable)
          .set({ ...changes, updatedAt: new Date() })
          .where(ownedBy(id, userId))
          .returning(),
      ),

    deleteById: async (id, userId) =>
      (await db.delete(equipmentSetsTable).where(ownedBy(id, userId)).returning()).length > NO_ROWS,

    /**
     * The partial unique index allows one default per user, so the previous one
     * has to go first. Both writes share a transaction; otherwise a failure
     * between them would leave the account with no default at all.
     */
    makeDefault: async (id, userId) =>
      db.transaction(async (tx): Promise<EquipmentSetRow | null> => {
        await tx
          .update(equipmentSetsTable)
          .set({ isDefault: NOT_DEFAULT, updatedAt: new Date() })
          .where(eq(equipmentSetsTable.userId, userId));

        return firstRowOrNull(
          await tx
            .update(equipmentSetsTable)
            .set({ isDefault: true, updatedAt: new Date() })
            .where(ownedBy(id, userId))
            .returning(),
        );
      }),

    /**
     * The jsonb array carries no foreign key, so this is the code that stands
     * in for `on delete cascade`. Read and rewrite rather than surgery in SQL:
     * a person owns a handful of sets, and being obviously correct is worth
     * more here than being clever.
     */
    pruneEquipmentId: async (equipmentId, userId): Promise<void> => {
      const affected = (await listAll(userId)).filter((row: EquipmentSetRow): boolean =>
        row.equipmentIds.includes(equipmentId),
      );

      await Promise.all(
        affected.map(
          async (row: EquipmentSetRow): Promise<unknown> =>
            db
              .update(equipmentSetsTable)
              .set({
                equipmentIds: row.equipmentIds.filter(
                  (candidate: string): boolean => candidate !== equipmentId,
                ),
                updatedAt: new Date(),
              })
              .where(eq(equipmentSetsTable.id, row.id)),
        ),
      );
    },
  };
};
