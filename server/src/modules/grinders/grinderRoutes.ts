import {
  API_ROUTES,
  createGrinderRequestSchema,
  errorResponseSchema,
  grinderQuerySchema,
  grinderSchema,
  idParamSchema,
  listResponseSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { GrinderService } from './grinderService.js';

export interface GrinderRoutesOptions {
  readonly grinderService: GrinderService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const grinderRoutes: FastifyPluginAsyncZod<GrinderRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.grinders,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: grinderQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(grinderSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.grinderService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.grinderById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: grinderSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.grinderService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.grinders,
    {
      onRequest: app.authenticate,
      schema: {
        body: createGrinderRequestSchema,
        response: {
          [HTTP_STATUS.created]: grinderSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.conflict]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const grinder = await options.grinderService.create(
        requireCurrentUser(request).id,
        request.body,
      );

      return reply.status(HTTP_STATUS.created).send(grinder);
    },
  );

  await Promise.resolve();
};
