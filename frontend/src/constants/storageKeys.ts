const NAMESPACE = 'brewmate';

/** AsyncStorage keys. Namespaced so a key can never collide with a library's. */
export const STORAGE_KEYS = {
  queryCache: `${NAMESPACE}.query-cache`,
  uiPreferences: `${NAMESPACE}.ui-preferences`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
