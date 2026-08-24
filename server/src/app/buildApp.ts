import { HTTP_HEADERS } from '@brewmate/shared';
import Fastify, { type FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { authPlugin } from '../auth/authPlugin.js';
import { errorHandler } from '../errors/errorHandler.js';
import { notFoundHandler } from '../errors/notFoundHandler.js';
import { createLoggerOptions } from '../logging/createLoggerOptions.js';
import { aiRoutes } from '../modules/ai/aiRoutes.js';
import { aiUsageRoutes } from '../modules/aiUsage/aiUsageRoutes.js';
import { bagEvaluationRoutes } from '../modules/bagEvaluations/bagEvaluationRoutes.js';
import { brewLogRoutes } from '../modules/brewLogs/brewLogRoutes.js';
import { brewMethodRoutes } from '../modules/brewMethods/brewMethodRoutes.js';
import { coffeeBagRoutes } from '../modules/coffeeBags/coffeeBagRoutes.js';
import { equipmentRoutes } from '../modules/equipment/equipmentRoutes.js';
import { equipmentSetRoutes } from '../modules/equipmentSets/equipmentSetRoutes.js';
import { grinderRoutes } from '../modules/grinders/grinderRoutes.js';
import { healthRoutes } from '../modules/health/healthRoutes.js';
import { recipeChatRoutes } from '../modules/recipeChat/recipeChatRoutes.js';
import { recipeRoutes } from '../modules/recipes/recipeRoutes.js';
import { tasteProfileRoutes } from '../modules/tasteProfiles/tasteProfileRoutes.js';
import { userRoutes } from '../modules/users/userRoutes.js';

import type { AppDependencies } from './appDependencies.js';
import { createServices } from './createServices.js';

/**
 * Wires the application without binding a port, so integration tests can drive
 * it through `app.inject()`.
 *
 * Every route below `/health` is registered with the `authenticate` hook and
 * scoped to the caller inside its service - there is no unauthenticated way
 * into anybody's coffee.
 */
export const buildApp = async (dependencies: AppDependencies): Promise<FastifyInstance> => {
  const { config, db, tokenVerifier, identityDeleter, ai } = dependencies;

  const app = Fastify({
    logger: createLoggerOptions(config.environment, config.logging.level),
    bodyLimit: config.server.bodyLimitBytes,
    requestIdHeader: HTTP_HEADERS.requestId,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);

  const services = createServices({ db, identityDeleter, ai });

  await app.register(authPlugin, { tokenVerifier, userService: services.userService });
  await app.register(healthRoutes, { db });
  await app.register(userRoutes, { userService: services.userService });
  await app.register(tasteProfileRoutes, { tasteProfileService: services.tasteProfileService });
  await app.register(brewMethodRoutes, { brewMethodService: services.brewMethodService });
  await app.register(grinderRoutes, { grinderService: services.grinderService });
  await app.register(equipmentRoutes, { equipmentService: services.equipmentService });
  await app.register(equipmentSetRoutes, { equipmentSetService: services.equipmentSetService });
  await app.register(coffeeBagRoutes, { coffeeBagService: services.coffeeBagService });
  await app.register(bagEvaluationRoutes, { bagEvaluationService: services.bagEvaluationService });
  await app.register(recipeRoutes, { recipeService: services.recipeService });
  await app.register(recipeChatRoutes, { recipeChatService: services.recipeChatService });
  await app.register(brewLogRoutes, { brewLogService: services.brewLogService });
  await app.register(aiUsageRoutes, { aiUsageService: services.aiUsageService });
  await app.register(aiRoutes, {
    coffeeBagParseService: services.coffeeBagParseService,
    coffeeEvaluationService: services.coffeeEvaluationService,
    recipeGenerationService: services.recipeGenerationService,
    recipeCoachService: services.recipeCoachService,
  });

  return app;
};
