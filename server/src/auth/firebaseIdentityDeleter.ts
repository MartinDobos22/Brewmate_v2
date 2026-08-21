import { getAuth } from 'firebase-admin/auth';

import type { FirebaseCredentials } from '../config/firebaseCredentials.js';

import { FIREBASE_AUTH_ERROR_CODES, readErrorCode } from './firebaseAuthErrorCodes.js';
import { createFirebaseApp } from './firebaseApp.js';
import type { IdentityDeleter } from './identityDeleter.js';

/**
 * Deletes the Firebase identity behind an account, so the credentials the user
 * signed in with stop working the moment they ask for their account to be
 * removed.
 */
export const createFirebaseIdentityDeleter = (
  credentials: FirebaseCredentials,
): IdentityDeleter => {
  const auth = getAuth(createFirebaseApp(credentials));

  return {
    deleteUser: async (firebaseUid: string): Promise<void> => {
      try {
        await auth.deleteUser(firebaseUid);
      } catch (error: unknown) {
        // Already gone is the state the caller asked for.
        if (readErrorCode(error) !== FIREBASE_AUTH_ERROR_CODES.userNotFound) {
          throw error;
        }
      }
    },
  };
};
