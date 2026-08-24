const NAMESPACE = 'brewmate';

/** AsyncStorage keys. Namespaced so a key can never collide with a library's. */
export const STORAGE_KEYS = {
  queryCache: `${NAMESPACE}.query-cache`,
  uiPreferences: `${NAMESPACE}.ui-preferences`,
  /**
   * Brews that happened but have not reached the API yet.
   *
   * Written to disk rather than kept in the query cache, because the thing it
   * protects against is the app being closed: somebody brews at a cabin with
   * no signal, the phone goes in a pocket, and the cup has to still be there
   * on Monday. A brew that was made is a fact, and losing it because a request
   * failed would be losing the most valuable history this app has.
   */
  pendingBrewLogs: `${NAMESPACE}.pending-brew-logs`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
