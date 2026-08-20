/** Runtime environments the server knows about. */
export const NODE_ENVIRONMENTS = {
  development: 'development',
  test: 'test',
  production: 'production',
} as const;

export type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[keyof typeof NODE_ENVIRONMENTS];
