import { eq, sql } from 'drizzle-orm';

import type { Database } from '../../db/databaseTypes.js';
import type { UserRow } from '../../db/schema/usersTable.js';
import { usersTable } from '../../db/schema/usersTable.js';
import { internalError } from '../../errors/internalError.js';

export interface ProvisionUserInput {
  readonly firebaseUid: string;
  readonly email: string | null;
}

export interface UpdatableUserFields {
  readonly displayName?: string | null;
}

export interface UserRepository {
  findById(id: string): Promise<UserRow | null>;
  findByFirebaseUid(firebaseUid: string): Promise<UserRow | null>;
  upsertByFirebaseUid(input: ProvisionUserInput): Promise<UserRow>;
  updateById(id: string, changes: UpdatableUserFields): Promise<UserRow | null>;
}

const firstRowOrNull = (rows: readonly UserRow[]): UserRow | null => rows[0] ?? null;

const requireRow = (rows: readonly UserRow[]): UserRow => {
  const row = rows[0];

  if (row === undefined) {
    throw internalError();
  }

  return row;
};

export const createUserRepository = (db: Database): UserRepository => ({
  findById: async (id) =>
    firstRowOrNull(await db.select().from(usersTable).where(eq(usersTable.id, id))),

  findByFirebaseUid: async (firebaseUid) =>
    firstRowOrNull(
      await db.select().from(usersTable).where(eq(usersTable.firebaseUid, firebaseUid)),
    ),

  /**
   * Upsert rather than select-then-insert: two concurrent first requests for the
   * same Firebase identity must not race into a duplicate key error.
   * An existing email is never overwritten with null.
   */
  upsertByFirebaseUid: async ({ firebaseUid, email }) =>
    requireRow(
      await db
        .insert(usersTable)
        .values({ firebaseUid, email })
        .onConflictDoUpdate({
          target: usersTable.firebaseUid,
          set: {
            email: sql`coalesce(excluded.${sql.raw(usersTable.email.name)}, ${usersTable.email})`,
            updatedAt: new Date(),
          },
        })
        .returning(),
    ),

  updateById: async (id, changes) =>
    firstRowOrNull(
      await db
        .update(usersTable)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(usersTable.id, id))
        .returning(),
    ),
});
