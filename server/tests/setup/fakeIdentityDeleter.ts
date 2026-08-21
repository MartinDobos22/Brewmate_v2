import type { IdentityDeleter } from '../../src/auth/identityDeleter.js';

export interface RecordingIdentityDeleter extends IdentityDeleter {
  /** Every uid the API asked the identity provider to remove, in order. */
  readonly deleted: readonly string[];
  readonly reset: () => void;
}

/**
 * Stands in for Firebase Admin's `deleteUser`, and records the calls so a test
 * can prove the identity was removed and not only the database row.
 */
export const createFakeIdentityDeleter = (): RecordingIdentityDeleter => {
  const deleted: string[] = [];

  return {
    deleted,
    deleteUser: (firebaseUid: string): Promise<void> => {
      deleted.push(firebaseUid);

      return Promise.resolve();
    },
    reset: (): void => {
      deleted.length = 0;
    },
  };
};
