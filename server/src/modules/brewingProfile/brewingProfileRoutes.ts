import { API_ROUTES, brewingProfileSchema, errorResponseSchema } from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { BrewingProfileService } from './brewingProfileService.js';

export interface BrewingProfileRoutesOptions {
  readonly brewingProfileService: BrewingProfileService;
}

/**
 * One read-only route. There is nothing to write: the profile is what the
 * cups add up to, and the only way to change it is to brew.
 */
export const brewingProfileRoutes: FastifyPluginAsyncZod<BrewingProfileRoutesOptions> = async (
  app,
  options,
) => {
  app.get(
    API_ROUTES.brewingProfile,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: brewingProfileSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.brewingProfileService.read(requireCurrentUser(request).id),
  );

  await Promise.resolve();
};
