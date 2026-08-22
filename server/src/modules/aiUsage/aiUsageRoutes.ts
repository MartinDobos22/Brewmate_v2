import {
  API_ROUTES,
  aiUsageLogSchema,
  errorResponseSchema,
  listQuerySchema,
  listResponseSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { AiUsageService } from './aiUsageService.js';

export interface AiUsageRoutesOptions {
  readonly aiUsageService: AiUsageService;
}

/**
 * Read-only, and only the caller's own usage. Writing these rows is the
 * server's business, so there is no POST here.
 */
export const aiUsageRoutes: FastifyPluginAsyncZod<AiUsageRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.aiUsage,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: listQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(aiUsageLogSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.aiUsageService.list(requireCurrentUser(request).id, request.query),
  );

  await Promise.resolve();
};
