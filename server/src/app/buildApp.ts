import Fastify, { type FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { HTTP_HEADERS } from '@brewmate/shared';

import { authPlugin } from '../auth/authPlugin.js';
import { errorHandler } from '../errors/errorHandler.js';
import { notFoundHandler } from '../errors/notFoundHandler.js';
import { createLoggerOptions } from '../logging/createLoggerOptions.js';
import { healthRoutes } from '../modules/health/healthRoutes.js';
import { createUserRepository } from '../modules/users/userRepository.js';
import { userRoutes } from '../modules/users/userRoutes.js';
import { createUserService } from '../modules/users/userService.js';

import type { AppDependencies } from './appDependencies.js';

/**
 * Wires the application without binding a port, so integration tests can drive
 * it through `app.inject()`.
 */
export const buildApp = async (dependencies: AppDependencies): Promise<FastifyInstance> => {
  const { config, db, tokenVerifier, identityDeleter } = dependencies;

  const app = Fastify({
    logger: createLoggerOptions(config.environment, config.logging.level),
    bodyLimit: config.server.bodyLimitBytes,
    requestIdHeader: HTTP_HEADERS.requestId,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);

  const userService = createUserService(createUserRepository(db), identityDeleter);

  await app.register(authPlugin, { tokenVerifier, userService });
  await app.register(healthRoutes, { db });
  await app.register(userRoutes, { userService });

  return app;
};
