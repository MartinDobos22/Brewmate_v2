import {
  API_ROUTES,
  accountExportSchema,
  deleteAccountResponseSchema,
  errorResponseSchema,
  updateUserRequestSchema,
  userSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';

import type { AccountExportService } from './accountExportService.js';
import type { UserService } from './userService.js';

export interface UserRoutesOptions {
  readonly userService: UserService;
  readonly accountExportService: AccountExportService;
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

  /**
   * The right to a copy, answered in the app rather than by email.
   *
   * A GET so it can be opened, saved and shared with whatever somebody wants
   * to read it in, and deliberately the same document every time: nothing here
   * is generated asynchronously or delivered later, because a request that
   * ends in "we will send you a link" is one people give up on. It reads every
   * user-owned table whole - an export that quietly stopped at the first
   * thousand brews would look complete and not be.
   */
  app.get(
    API_ROUTES.meExport,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: accountExportSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.accountExportService.export(requireCurrentUser(request).id),
  );

  /**
   * Apple requires an app that can create an account to be able to delete it
   * from inside the app, so this endpoint removes the stored data *and* the
   * Firebase identity behind it.
   */
  app.delete(
    API_ROUTES.me,
    {
      onRequest: app.authenticate,
      schema: {
        response: {
          [HTTP_STATUS.ok]: deleteAccountResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
        },
      },
    },
    async (request) => options.userService.deleteAccount(requireCurrentUser(request)),
  );

  await Promise.resolve();
};
