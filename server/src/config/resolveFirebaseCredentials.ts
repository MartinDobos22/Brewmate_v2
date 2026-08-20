import type { Env } from './envSchema.js';
import type { FirebaseCredentials } from './firebaseCredentials.js';
import { normalizePrivateKey } from './normalizePrivateKey.js';

/**
 * @returns the credentials, or null when they are absent (test environment only -
 * the schema rejects a missing configuration everywhere else).
 */
export const resolveFirebaseCredentials = (env: Env): FirebaseCredentials | null => {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = env;

  if (
    FIREBASE_PROJECT_ID === undefined ||
    FIREBASE_CLIENT_EMAIL === undefined ||
    FIREBASE_PRIVATE_KEY === undefined
  ) {
    return null;
  }

  return {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(FIREBASE_PRIVATE_KEY),
  };
};
