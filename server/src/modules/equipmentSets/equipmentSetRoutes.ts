import {
  API_ROUTES,
  createEquipmentSetRequestSchema,
  deletedResponseSchema,
  equipmentSetSchema,
  errorResponseSchema,
  idParamSchema,
  listQuerySchema,
  listResponseSchema,
  updateEquipmentSetRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { EquipmentSetService } from './equipmentSetService.js';

export interface EquipmentSetRoutesOptions {
  readonly equipmentSetService: EquipmentSetService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const equipmentSetRoutes: FastifyPluginAsyncZod<EquipmentSetRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.equipmentSets,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: listQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(equipmentSetSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.equipmentSetService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.equipmentSetById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: equipmentSetSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.equipmentSetService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.equipmentSets,
    {
      onRequest: app.authenticate,
      schema: {
        body: createEquipmentSetRequestSchema,
        response: {
          [HTTP_STATUS.created]: equipmentSetSchema,
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
          await options.equipmentSetService.create(requireCurrentUser(request).id, request.body),
        ),
  );

  app.patch(
    API_ROUTES.equipmentSetById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: updateEquipmentSetRequestSchema,
        response: {
          [HTTP_STATUS.ok]: equipmentSetSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.equipmentSetService.update(
        requireCurrentUser(request).id,
        request.params.id,
        request.body,
      ),
  );

  app.delete(
    API_ROUTES.equipmentSetById,
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
      options.equipmentSetService.remove(requireCurrentUser(request).id, request.params.id),
  );

  await Promise.resolve();
};
