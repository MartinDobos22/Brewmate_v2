import {
  API_ROUTES,
  createRecipeRequestSchema,
  deletedResponseSchema,
  errorResponseSchema,
  idParamSchema,
  listResponseSchema,
  recipeQuerySchema,
  recipeSchema,
  updateRecipeRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { RecipeService } from './recipeService.js';

export interface RecipeRoutesOptions {
  readonly recipeService: RecipeService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const recipeRoutes: FastifyPluginAsyncZod<RecipeRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.recipes,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: recipeQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(recipeSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.recipeService.list(requireCurrentUser(request).id, request.query),
  );

  app.get(
    API_ROUTES.recipeById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: recipeSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.recipeService.getById(requireCurrentUser(request).id, request.params.id),
  );

  app.post(
    API_ROUTES.recipes,
    {
      onRequest: app.authenticate,
      schema: {
        body: createRecipeRequestSchema,
        response: {
          [HTTP_STATUS.created]: recipeSchema,
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
        .send(await options.recipeService.create(requireCurrentUser(request).id, request.body)),
  );

  app.patch(
    API_ROUTES.recipeById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: updateRecipeRequestSchema,
        response: {
          [HTTP_STATUS.ok]: recipeSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.recipeService.update(
        requireCurrentUser(request).id,
        request.params.id,
        request.body,
      ),
  );

  app.delete(
    API_ROUTES.recipeById,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        response: {
          [HTTP_STATUS.ok]: deletedResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.conflict]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.recipeService.remove(requireCurrentUser(request).id, request.params.id),
  );

  await Promise.resolve();
};
