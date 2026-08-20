import { DEPENDENCY_STATUS, HEALTH_STATUS } from '@brewmate/shared';
import type { DependencyStatus, HealthResponse } from '@brewmate/shared';
import type { FastifyBaseLogger } from 'fastify';

import type { Database } from '../../db/databaseTypes.js';
import { pingDatabase } from '../../db/pingDatabase.js';
import { LOG_MESSAGES } from '../../logging/logMessages.js';

const resolveDatabaseStatus = async (
  db: Database,
  logger: FastifyBaseLogger,
): Promise<DependencyStatus> => {
  try {
    await pingDatabase(db);

    return DEPENDENCY_STATUS.up;
  } catch (error: unknown) {
    logger.error({ err: error }, LOG_MESSAGES.databasePingFailed);

    return DEPENDENCY_STATUS.down;
  }
};

/** Reports liveness plus the state of every dependency the API needs. */
export const checkHealth = async (
  db: Database,
  logger: FastifyBaseLogger,
): Promise<HealthResponse> => {
  const database = await resolveDatabaseStatus(db, logger);

  return {
    status: database === DEPENDENCY_STATUS.up ? HEALTH_STATUS.ok : HEALTH_STATUS.degraded,
    uptimeSeconds: process.uptime(),
    checkedAt: new Date().toISOString(),
    dependencies: { database },
  };
};
