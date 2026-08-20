import { z } from 'zod';

import type { VerifiedToken } from '../../src/auth/verifiedToken.js';

const TOKEN_ENCODING = 'base64url';
const PAYLOAD_ENCODING = 'utf8';

export const testIdTokenPayloadSchema = z.object({
  firebaseUid: z.string(),
  email: z.string().nullable(),
});

/**
 * Mints a token the fake verifier understands. Real Firebase ID tokens cannot
 * be produced in CI, so the token carries its own (unsigned) payload and the
 * fake verifier plays the role of the Firebase Admin SDK.
 */
export const createTestIdToken = (token: VerifiedToken): string =>
  Buffer.from(JSON.stringify(token), PAYLOAD_ENCODING).toString(TOKEN_ENCODING);

export const decodeTestIdToken = (idToken: string): VerifiedToken => {
  const decoded: unknown = JSON.parse(
    Buffer.from(idToken, TOKEN_ENCODING).toString(PAYLOAD_ENCODING),
  );

  return testIdTokenPayloadSchema.parse(decoded);
};
