import {
  API_ROUTES,
  createTasteProfileEventRequestSchema,
  errorResponseSchema,
  listQuerySchema,
  listResponseSchema,
  tasteProfileEventSchema,
  tasteProfileSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { TasteProfileService } from './tasteProfileService.js';

export interface TasteProfileRoutesOptions {
  readonly tasteProfileService: TasteProfileService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const tasteProfileRoutes: FastifyPluginAsyncZod<TasteProfileRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.tasteProfile,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: tasteProfileSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.tasteProfileService.get(requireCurrentUser(request).id),
  );

  app.get(
    API_ROUTES.tasteProfileEvents,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: listQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(tasteProfileEventSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.tasteProfileService.listEvents(requireCurrentUser(request).id, request.query),
  );

  /**
   * Appends to the audit trail. Sending the same `source` and `sourceRef`
   * twice answers with the event that already exists, so a retry on a flaky
   * connection cannot count the same evidence twice.
   */
  app.post(
    API_ROUTES.tasteProfileEvents,
    {
      onRequest: app.authenticate,
      schema: {
        body: createTasteProfileEventRequestSchema,
        response: {
          [HTTP_STATUS.created]: tasteProfileEventSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(
          await options.tasteProfileService.addEvent(requireCurrentUser(request).id, request.body),
        ),
  );

  /** Rebuilds the profile from its events. Running it twice changes nothing. */
  app.post(
    API_ROUTES.tasteProfileRecompute,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: tasteProfileSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.tasteProfileService.recompute(requireCurrentUser(request).id),
  );

  await Promise.resolve();
};
