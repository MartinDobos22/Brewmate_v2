import {
  API_ROUTES,
  brewLogQuerySchema,
  brewLogSchema,
  createBrewLogRequestSchema,
  deletedResponseSchema,
  errorResponseSchema,
  idParamSchema,
  listResponseSchema,
  updateBrewLogRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { BrewLogService } from './brewLogService.js';

export interface BrewLogRoutesOptions {
  readonly brewLogService: BrewLogService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const brewLogRoutes: FastifyPluginAsyncZod<BrewLogRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.brewLogs,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: brewLogQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(brewLogSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.brewLogService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.brewLogById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: brewLogSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.brewLogService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.brewLogs,
    {
      onRequest: app.authenticate,
      schema: {
        body: createBrewLogRequestSchema,
        response: {
          [HTTP_STATUS.created]: brewLogSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(await options.brewLogService.create(requireCurrentUser(request).id, request.body)),
  );

  app.patch(
    API_ROUTES.brewLogById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: updateBrewLogRequestSchema,
        response: {
          [HTTP_STATUS.ok]: brewLogSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.brewLogService.update(
        requireCurrentUser(request).id,
        request.params.id,
        request.body,
      ),
  );

  app.delete(
    API_ROUTES.brewLogById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: deletedResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.brewLogService.remove(requireCurrentUser(request).id, request.params.id),
  );

  await Promise.resolve();
};
