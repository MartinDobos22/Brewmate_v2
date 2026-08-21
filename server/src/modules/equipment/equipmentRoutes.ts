import {
  API_ROUTES,
  createEquipmentRequestSchema,
  deletedResponseSchema,
  equipmentQuerySchema,
  equipmentSchema,
  errorResponseSchema,
  idParamSchema,
  listResponseSchema,
  updateEquipmentRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { EquipmentService } from './equipmentService.js';

export interface EquipmentRoutesOptions {
  readonly equipmentService: EquipmentService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const equipmentRoutes: FastifyPluginAsyncZod<EquipmentRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.equipment,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: equipmentQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(equipmentSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.equipmentService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.equipmentById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: equipmentSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.equipmentService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.equipment,
    {
      onRequest: app.authenticate,
      schema: {
        body: createEquipmentRequestSchema,
        response: {
          [HTTP_STATUS.created]: equipmentSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(
          await options.equipmentService.create(requireCurrentUser(request).id, request.body),
        ),
  );

  app.patch(
    API_ROUTES.equipmentById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: updateEquipmentRequestSchema,
        response: {
          [HTTP_STATUS.ok]: equipmentSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.equipmentService.update(
        requireCurrentUser(request).id,
        request.params.id,
        request.body,
      ),
  );

  app.delete(
    API_ROUTES.equipmentById,
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
      options.equipmentService.remove(requireCurrentUser(request).id, request.params.id),
  );

  await Promise.resolve();
};
