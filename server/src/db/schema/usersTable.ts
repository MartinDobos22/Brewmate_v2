import { WATER_TYPES, type OnboardingState } from '@brewmate/shared';
import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { waterTypeEnum } from './columnEnums.js';
import { TABLE_NAMES } from './tableNames.js';

const FIREBASE_UID_INDEX_NAME = 'users_firebase_uid_unique_idx';

/**
 * Internal user record. `firebase_uid` is the only link to the identity
 * provider; everything else in the product references `id`.
 *
 * Every user-owned table below cascades from this row, which is what makes
 * `DELETE /me` actually erase an account rather than merely disown it.
 */
export const usersTable = pgTable(
  TABLE_NAMES.users,
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firebaseUid: text('firebase_uid').notNull(),
    email: text('email'),
    displayName: text('display_name'),
    /** The account-wide default; a recipe and a brew log each record their own. */
    waterType: waterTypeEnum('water_type').notNull().default(WATER_TYPES.unknown),
    onboardingState: jsonb('onboarding_state').$type<OnboardingState>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex(FIREBASE_UID_INDEX_NAME).on(table.firebaseUid)],
);

export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;
