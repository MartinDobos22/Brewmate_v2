import {
  API_ROUTES,
  errorResponseSchema,
  updateUserRequestSchema,
  userSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { UserService } from './userService.js';

export interface UserRoutesOptions {
  readonly userService: UserService;
}

/**
 * Route handlers stay free of business logic: they resolve the caller and
 * delegate to the user service.
 */
export const userRoutes: FastifyPluginAsyncZod<UserRoutesOptions> = async (app, options) => {
  app.get(
    API_ROUTES.me,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: userSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    (request) => requireCurrentUser(request),
  );

  app.patch(
    API_ROUTES.me,
    {
      onRequest: app.authenticate,
      schema: {
        body: updateUserRequestSchema,
        response: {
          [HTTP_STATUS.ok]: userSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      options.userService.updateProfile(requireCurrentUser(request).id, request.body),
  );

  await Promise.resolve();
};
