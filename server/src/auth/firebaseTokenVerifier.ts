import { getAuth } from 'firebase-admin/auth';

import type { FirebaseCredentials } from '../config/firebaseCredentials.js';
import { ERROR_MESSAGES } from '../errors/errorMessages.js';
import { unauthorizedError } from '../errors/unauthorizedError.js';

import { createFirebaseApp } from './firebaseApp.js';
import type { TokenVerifier } from './tokenVerifier.js';
import type { VerifiedToken } from './verifiedToken.js';

/**
 * Revocation checks cost an extra round-trip to Firebase on every request.
 * Signature and expiry are validated locally, which is enough for this API.
 */
const CHECK_REVOKED = false;

export const createFirebaseTokenVerifier = (credentials: FirebaseCredentials): TokenVerifier => {
  const auth = getAuth(createFirebaseApp(credentials));

  return {
    verifyIdToken: async (idToken: string): Promise<VerifiedToken> => {
      try {
        const decoded = await auth.verifyIdToken(idToken, CHECK_REVOKED);

        return { firebaseUid: decoded.uid, email: decoded.email ?? null };
      } catch (error: unknown) {
        throw unauthorizedError(ERROR_MESSAGES.invalidIdToken, error);
      }
    },
  };
};
