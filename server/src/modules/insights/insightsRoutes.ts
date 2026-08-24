import {
  API_ROUTES,
  acceptTasteSuggestionResponseSchema,
  dismissTasteSuggestionResponseSchema,
  errorResponseSchema,
  insightsResponseSchema,
  tasteSuggestionRefSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { InsightsService } from './insightsService.js';

export interface InsightsRoutesOptions {
  readonly insightsService: InsightsService;
}

/**
 * Three routes, and only one of them can ever spend anything.
 *
 * `GET /insights` may write one cheap sentence the first time it meets a new
 * piece of evidence, and answers from the stored one afterwards - so it is
 * deliberately not behind the `/ai/*` allowance: the report is arithmetic and
 * has to keep working when the allowance is gone. The service checks the
 * allowance itself before spending, and falls back to a plainer card rather
 * than to an error.
 */
export const insightsRoutes: FastifyPluginAsyncZod<InsightsRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.insights,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: insightsResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.insightsService.read(requireCurrentUser(request).id),
  );

  app.post(
    API_ROUTES.insightSuggestionAccept,
    {
      onRequest: app.authenticate,
      schema: {
        body: tasteSuggestionRefSchema,
        response: {
          [HTTP_STATUS.created]: acceptTasteSuggestionResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(
          await options.insightsService.accept(requireCurrentUser(request).id, request.body.ref),
        ),
  );

  app.post(
    API_ROUTES.insightSuggestionDismiss,
    {
      onRequest: app.authenticate,
      schema: {
        body: tasteSuggestionRefSchema,
        response: {
          [HTTP_STATUS.ok]: dismissTasteSuggestionResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.insightsService.dismiss(requireCurrentUser(request).id, request.body.ref),
  );

  await Promise.resolve();
};
