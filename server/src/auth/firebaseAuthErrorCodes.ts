/** Firebase Admin error codes the API reacts to by name. */
export const FIREBASE_AUTH_ERROR_CODES = {
  userNotFound: 'auth/user-not-found',
} as const;

/** Reads the `code` property Firebase Admin puts on its errors, if there is one. */
export const readErrorCode = (error: unknown): string | null => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  const { code } = error;

  return typeof code === 'string' ? code : null;
};
