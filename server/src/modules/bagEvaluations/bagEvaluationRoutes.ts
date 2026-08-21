import {
  API_ROUTES,
  bagEvaluationSchema,
  createBagEvaluationRequestSchema,
  errorResponseSchema,
  idParamSchema,
  listQuerySchema,
  listResponseSchema,
  updateBagEvaluationRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { BagEvaluationService } from './bagEvaluationService.js';

export interface BagEvaluationRoutesOptions {
  readonly bagEvaluationService: BagEvaluationService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const bagEvaluationRoutes: FastifyPluginAsyncZod<BagEvaluationRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.bagEvaluations,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: listQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(bagEvaluationSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.bagEvaluationService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.bagEvaluationById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: bagEvaluationSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.bagEvaluationService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.bagEvaluations,
    {
      onRequest: app.authenticate,
      schema: {
        body: createBagEvaluationRequestSchema,
        response: {
          [HTTP_STATUS.created]: bagEvaluationSchema,
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
          await options.bagEvaluationService.create(requireCurrentUser(request).id, request.body),
        ),
  );

  app.patch(
    API_ROUTES.bagEvaluationById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: updateBagEvaluationRequestSchema,
        response: {
          [HTTP_STATUS.ok]: bagEvaluationSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.bagEvaluationService.update(
        requireCurrentUser(request).id,
        request.params.id,
        request.body,
      ),
  );

  await Promise.resolve();
};
