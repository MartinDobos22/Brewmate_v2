import type { VerifiedToken } from './verifiedToken.js';

/**
 * Verifies Firebase ID tokens. Implemented by the Firebase Admin SDK in
 * production and by a stub in integration tests, so the HTTP layer never
 * depends on a live identity provider.
 */
export interface TokenVerifier {
  verifyIdToken(idToken: string): Promise<VerifiedToken>;
}
