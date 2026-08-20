/** Overall service health reported by the health endpoint. */
export const HEALTH_STATUS = {
  ok: 'ok',
  degraded: 'degraded',
} as const;

export type HealthStatus = (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];

/** Health of a single downstream dependency. */
export const DEPENDENCY_STATUS = {
  up: 'up',
  down: 'down',
} as const;

export type DependencyStatus = (typeof DEPENDENCY_STATUS)[keyof typeof DEPENDENCY_STATUS];
