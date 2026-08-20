import { HTTP_HEADERS } from '@brewmate/shared';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import type { UserService } from '../modules/users/userService.js';

import { extractBearerToken } from './extractBearerToken.js';
import type { TokenVerifier } from './tokenVerifier.js';

const PLUGIN_NAME = 'brewmate-auth';
const CURRENT_USER_DECORATOR = 'currentUser';
const AUTHENTICATE_DECORATOR = 'authenticate';

export interface AuthPluginOptions {
  readonly tokenVerifier: TokenVerifier;
  readonly userService: UserService;
}

/**
 * Registers the `authenticate` onRequest hook: verify the Firebase ID token,
 * map firebase_uid to an internal user (creating it on first login) and expose
 * that user as `request.currentUser`.
 */
const authPluginCallback = async (
  app: FastifyInstance,
  options: AuthPluginOptions,
): Promise<void> => {
  app.decorateRequest(CURRENT_USER_DECORATOR, null);

  app.decorate(AUTHENTICATE_DECORATOR, async (request: FastifyRequest): Promise<void> => {
    const idToken = extractBearerToken(request.headers[HTTP_HEADERS.authorization]);
    const verifiedToken = await options.tokenVerifier.verifyIdToken(idToken);

    request.currentUser = await options.userService.provisionFromIdentity(verifiedToken);
  });

  await Promise.resolve();
};

export const authPlugin = fp(authPluginCallback, { name: PLUGIN_NAME });
