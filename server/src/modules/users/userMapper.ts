import type { User } from '@brewmate/shared';

import type { UserRow } from '../../db/schema/usersTable.js';

/** Converts a database row into the shape declared by the shared contract. */
export const toUser = (row: UserRow): User => ({
  id: row.id,
  firebaseUid: row.firebaseUid,
  email: row.email,
  displayName: row.displayName,
  waterType: row.waterType,
  onboardingState: row.onboardingState ?? null,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});
