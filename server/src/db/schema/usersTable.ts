import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames.js';

const FIREBASE_UID_INDEX_NAME = 'users_firebase_uid_unique_idx';

/**
 * Internal user record. `firebase_uid` is the only link to the identity
 * provider; everything else in the product references `id`.
 */
export const usersTable = pgTable(
  TABLE_NAMES.users,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firebaseUid: text('firebase_uid').notNull(),
    email: text('email'),
    displayName: text('display_name'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex(FIREBASE_UID_INDEX_NAME).on(table.firebaseUid)],
);

export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;
