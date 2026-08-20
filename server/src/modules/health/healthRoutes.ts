import { API_ROUTES, HEALTH_STATUS, healthResponseSchema } from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { HTTP_STATUS } from '../../constants/httpStatus.js';
import type { Database } from '../../db/databaseTypes.js';

import { checkHealth } from './healthService.js';

export interface HealthRoutesOptions {
  readonly db: Database;
}

/** Unauthenticated: probes must be able to reach it. */
export const healthRoutes: FastifyPluginAsyncZod<HealthRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.health,
    {
      schema: {
        response: {
          [HTTP_STATUS.ok]: healthResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: healthResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const health = await checkHealth(options.db, app.log);
      const statusCode =
        health.status === HEALTH_STATUS.ok ? HTTP_STATUS.ok : HTTP_STATUS.serviceUnavailable;

      return reply.status(statusCode).send(health);
    },
  );

  await Promise.resolve();
};
