import {
  API_ROUTES,
  brewMethodQuerySchema,
  brewMethodSchema,
  errorResponseSchema,
  listResponseSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { BrewMethodService } from './brewMethodService.js';

export interface BrewMethodRoutesOptions {
  readonly brewMethodService: BrewMethodService;
}

/**
 * The method catalogue is shared rather than per-user, but it still sits
 * behind authentication: nothing about this API is public except `/health`.
 */
export const brewMethodRoutes: FastifyPluginAsyncZod<BrewMethodRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.brewMethods,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: brewMethodQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(brewMethodSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.brewMethodService.list(request.query),
  );

  await Promise.resolve();
};
