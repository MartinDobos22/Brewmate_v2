import {
  API_ROUTES,
  createRecipeChatMessageRequestSchema,
  errorResponseSchema,
  idParamSchema,
  listQuerySchema,
  listResponseSchema,
  recipeChatMessageSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { RecipeChatService } from './recipeChatService.js';

export interface RecipeChatRoutesOptions {
  readonly recipeChatService: RecipeChatService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const recipeChatRoutes: FastifyPluginAsyncZod<RecipeChatRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.recipeMessages,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        querystring: listQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(recipeChatMessageSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.recipeChatService.list(
        requireCurrentUser(request).id,
        request.params.id,
        request.query,
      ),
  );

  app.post(
    API_ROUTES.recipeMessages,
    {
      onRequest: app.authenticate,
      schema: {
        params: idParamSchema,
        body: createRecipeChatMessageRequestSchema,
        response: {
          [HTTP_STATUS.created]: recipeChatMessageSchema,
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
          await options.recipeChatService.append(
            requireCurrentUser(request).id,
            request.params.id,
            request.body,
          ),
        ),
  );

  await Promise.resolve();
};
