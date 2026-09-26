import {
  API_ROUTES,
  bagRatingQuerySchema,
  bagRatingSchema,
  errorResponseSchema,
  listResponseSchema,
  rateBagRequestSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { BagRatingService } from './bagRatingService.js';

export interface BagRatingRoutesOptions {
  readonly bagRatingService: BagRatingService;
}

/** Route handlers resolve the caller and delegate; the rules live in the service. */
export const bagRatingRoutes: FastifyPluginAsyncZod<BagRatingRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.bagRatings,
    {
      onRequest: app.authenticate,
      schema: {
        querystring: bagRatingQuerySchema,
        response: {
          [HTTP_STATUS.ok]: listResponseSchema(bagRatingSchema),
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.bagRatingService.list(requireCurrentUser(request).id, request.query),
  );

  /** A put, because the bag and the stage name the one rating this is. */
  app.put(
    API_ROUTES.bagRatings,
    {
      onRequest: app.authenticate,
      schema: {
        body: rateBagRequestSchema,
        response: {
          [HTTP_STATUS.ok]: bagRatingSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) => options.bagRatingService.rate(requireCurrentUser(request).id, request.body),
  );

  await Promise.resolve();
};
