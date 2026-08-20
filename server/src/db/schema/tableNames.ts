/** Physical table names. Referenced by migrations, queries and test cleanup. */
export const TABLE_NAMES = {
  users: 'users',
} as const;

export type TableName = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];
