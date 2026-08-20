import type { TokenVerifier } from '../../src/auth/tokenVerifier.js';
import type { VerifiedToken } from '../../src/auth/verifiedToken.js';
import { ERROR_MESSAGES } from '../../src/errors/errorMessages.js';
import { unauthorizedError } from '../../src/errors/unauthorizedError.js';

import { decodeTestIdToken } from './testIdToken.js';

/**
 * Stands in for the Firebase Admin SDK: accepts tokens minted by
 * `createTestIdToken` and rejects everything else, exactly as the real
 * verifier rejects a forged or expired token.
 */
export const createFakeTokenVerifier = (): TokenVerifier => ({
  verifyIdToken: (idToken: string): Promise<VerifiedToken> => {
    try {
      return Promise.resolve(decodeTestIdToken(idToken));
    } catch (error: unknown) {
      throw unauthorizedError(ERROR_MESSAGES.invalidIdToken, error);
    }
  },
});
