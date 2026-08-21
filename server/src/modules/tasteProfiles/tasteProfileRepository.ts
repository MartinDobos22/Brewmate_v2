import { eq } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import { firstRowOrNull } from '../../db/rows/firstRowOrNull.js';
import { requireRow } from '../../db/rows/requireRow.js';
import type { NewTasteProfileRow, TasteProfileRow } from '../../db/schema/tasteProfilesTable.js';
import { tasteProfilesTable } from '../../db/schema/tasteProfilesTable.js';

export interface TasteProfileRepository {
  findByUserId(userId: string): Promise<TasteProfileRow | null>;
  /**
   * Writes the folded profile.
   *
   * `user_id` is the primary key, so this is a plain upsert and two concurrent
   * recomputes cannot leave an account with two profiles.
   */
  save(userId: string, state: Omit<NewTasteProfileRow, 'userId'>): Promise<TasteProfileRow>;
}

export const createTasteProfileRepository = (db: Database): TasteProfileRepository => ({
  findByUserId: async (userId) =>
    firstRowOrNull(
      await db.select().from(tasteProfilesTable).where(eq(tasteProfilesTable.userId, userId)),
    ),

  save: async (userId, state) =>
    requireRow(
      await db
        .insert(tasteProfilesTable)
        .values({ ...state, userId, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: tasteProfilesTable.userId,
          set: { ...state, updatedAt: new Date() },
        })
        .returning(),
    ),
});
