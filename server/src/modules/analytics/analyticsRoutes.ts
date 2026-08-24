import {
  API_ROUTES,
  createAnalyticsEventsRequestSchema,
  createAnalyticsEventsResponseSchema,
  errorResponseSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { AnalyticsService } from './analyticsService.js';

export interface AnalyticsRoutesOptions {
  readonly analyticsService: AnalyticsService;
}

/**
 * One route, authenticated like everything else.
 *
 * Authenticated because the rows are scoped to an account - which is the only
 * honest way to hold them. An "anonymous" endpoint keyed by a device id would
 * be the same personal data wearing a different name, and neither exportable
 * nor deletable when somebody asks.
 *
 * The caller is taken from the token rather than from the body, so a client
 * cannot file events against somebody else.
 */
export const analyticsRoutes: FastifyPluginAsyncZod<AnalyticsRoutesOptions> = async (
  app,
  options,
) => {
  app.post(
    API_ROUTES.analyticsEvents,
    {
      onRequest: app.authenticate,
      schema: {
        body: createAnalyticsEventsRequestSchema,
        response: {
          [HTTP_STATUS.created]: createAnalyticsEventsResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(await options.analyticsService.record(requireCurrentUser(request).id, request.body)),
  );

  await Promise.resolve();
};
