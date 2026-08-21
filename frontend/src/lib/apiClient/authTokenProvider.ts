/**
 * Supplies the Firebase ID token for the Authorization header.
 *
 * Authentication lands in a later milestone; until then the app runs with a
 * provider that returns null and the client simply omits the header.
 */
export type AuthTokenProvider = () => Promise<string | null>;

export const anonymousTokenProvider: AuthTokenProvider = (): Promise<string | null> =>
  Promise.resolve(null);
