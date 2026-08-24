import {
  API_ROUTES,
  errorResponseSchema,
  recipeTimelineQuerySchema,
  recipeTimelineSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { HistoryService } from './historyService.js';

export interface HistoryRoutesOptions {
  readonly historyService: HistoryService;
}

/**
 * Reading the past costs nothing and asks no model anything, so this route is
 * deliberately outside the allowance the `/ai/*` routes are held to. An
 * account that has used up its model calls for the month can still read every
 * cup it ever brewed.
 */
export const historyRoutes: FastifyPluginAsyncZod<HistoryRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.historyTimeline,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: recipeTimelineQuerySchema,
        response: {
          [HTTP_STATUS.ok]: recipeTimelineSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.historyService.timeline(requireCurrentUser(request).id, request.query),
  );

  await Promise.resolve();
};
