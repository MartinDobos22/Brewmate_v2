/**
 * Supplies the Firebase ID token for the Authorization header.
 *
 * `forceRefresh` asks the provider to skip its cache and fetch a new token; the
 * client uses it to retry once after a 401.
 */
export type AuthTokenProvider = (forceRefresh: boolean) => Promise<string | null>;

/** Used before anyone is signed in: the client omits the header entirely. */
export const anonymousTokenProvider: AuthTokenProvider = (): Promise<string | null> =>
  Promise.resolve(null);
