import {
  API_ROUTES,
  coffeeBagQuerySchema,
  coffeeBagSchema,
  createCoffeeBagRequestSchema,
  errorResponseSchema,
  idParamSchema,
  listResponseSchema,
  updateCoffeeBagRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { CoffeeBagService } from './coffeeBagService.js';

export interface CoffeeBagRoutesOptions {
  readonly coffeeBagService: CoffeeBagService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const coffeeBagRoutes: FastifyPluginAsyncZod<CoffeeBagRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.coffeeBags,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: coffeeBagQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(coffeeBagSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.coffeeBagService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.coffeeBagById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: coffeeBagSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.coffeeBagService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.coffeeBags,
    {
      onRequest: app.authenticate,
      schema: {
        body: createCoffeeBagRequestSchema,
        response: {
          [HTTP_STATUS.created]: coffeeBagSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(
          await options.coffeeBagService.create(requireCurrentUser(request).id, request.body),
        ),
  );

  app.patch(
    API_ROUTES.coffeeBagById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: updateCoffeeBagRequestSchema,
        response: {
          [HTTP_STATUS.ok]: coffeeBagSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.coffeeBagService.update(
        requireCurrentUser(request).id,
        request.params.id,
        request.body,
      ),
  );

  /**
   * Archives the bag and answers with it.
   *
   * The row survives on purpose - brew logs point at it, and the history of a
   * finished bag is the most valuable thing this app accumulates. Answering
   * with the archived bag rather than an empty 204 says so plainly.
   */
  app.delete(
    API_ROUTES.coffeeBagById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: coffeeBagSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.coffeeBagService.archive(requireCurrentUser(request).id, request.params.id),
  );

  await Promise.resolve();
};
