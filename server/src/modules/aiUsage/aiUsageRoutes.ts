import {
  API_ROUTES,
  aiUsageLogSchema,
  aiUsageSummarySchema,
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

  /**
   * The cost dashboard, computed from the same rows the limiter reads.
   *
   * One endpoint rather than letting the app add the page up itself: a client
   * that summed its own log would be summing the page it happens to have, and
   * would disagree with the ceiling the API enforces the moment somebody
   * scrolled.
   */
  app.get(
    API_ROUTES.aiUsageSummary,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: aiUsageSummarySchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.aiUsageService.summarize(requireCurrentUser(request).id),
  );

  await Promise.resolve();
};
