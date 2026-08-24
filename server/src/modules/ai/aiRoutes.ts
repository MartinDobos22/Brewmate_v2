import {
  API_ROUTES,
  errorResponseSchema,
  evaluateCoffeeRequestSchema,
  evaluateCoffeeResponseSchema,
  generateRecipeRequestSchema,
  generateRecipeResponseSchema,
  parseCoffeeBagRequestSchema,
  parseCoffeeBagResponseSchema,
  recipeChatRequestSchema,
  recipeChatResponseSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../errors/serviceUnavailableError.js';

import type { CoffeeBagParseService } from './coffeeBagParse/coffeeBagParseService.js';
import type { CoffeeEvaluationService } from './coffeeEvaluation/coffeeEvaluationService.js';
import type { RecipeCoachService } from './recipeCoach/recipeCoachService.js';
import type { RecipeGenerationService } from './recipeEngine/recipeGenerationService.js';

export interface AiRoutesOptions {
  /** Null wherever no model provider is configured; every route then answers 503. */
  readonly coffeeBagParseService: CoffeeBagParseService | null;
  readonly coffeeEvaluationService: CoffeeEvaluationService | null;
  readonly recipeGenerationService: RecipeGenerationService | null;
  readonly recipeCoachService: RecipeCoachService | null;
}

const requireService = <TService>(service: TService | null): TService => {
  if (service === null) {
    throw serviceUnavailableError(ERROR_MESSAGES.aiUnavailable);
  }

  return service;
};

/**
 * The routes that cost money.
 *
 * All four are registered whether or not a provider is configured: a
 * deployment without a key answers "not available right now", which is what
 * lets the app fall back - the form instead of the scanner, the offline rules
 * instead of the verdict. A route that simply did not exist would reach the
 * phone as a 404 and read like a bug in the app.
 */
export const aiRoutes: FastifyPluginAsyncZod<AiRoutesOptions> = async (app, options) => {
  app.post(
    API_ROUTES.aiParseCoffeeBag,
    {
      onRequest: app.authenticate,
      schema: {
        body: parseCoffeeBagRequestSchema,
        response: {
          [HTTP_STATUS.ok]: parseCoffeeBagResponseSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      requireService(options.coffeeBagParseService).parse(
        requireCurrentUser(request).id,
        request.body.imageUrl,
      ),
  );

  app.post(
    API_ROUTES.aiEvaluateCoffee,
    {
      onRequest: app.authenticate,
      schema: {
        body: evaluateCoffeeRequestSchema,
        response: {
          [HTTP_STATUS.ok]: evaluateCoffeeResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      requireService(options.coffeeEvaluationService).evaluate(
        requireCurrentUser(request).id,
        request.body,
      ),
  );

  app.post(
    API_ROUTES.aiGenerateRecipe,
    {
      onRequest: app.authenticate,
      schema: {
        body: generateRecipeRequestSchema,
        response: {
          [HTTP_STATUS.created]: generateRecipeResponseSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(
          await requireService(options.recipeGenerationService).generate(
            requireCurrentUser(request).id,
            request.body,
          ),
        ),
  );

  app.post(
    API_ROUTES.aiRecipeChat,
    {
      onRequest: app.authenticate,
      schema: {
        body: recipeChatRequestSchema,
        response: {
          [HTTP_STATUS.created]: recipeChatResponseSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.notFound]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: errorResponseSchema,
        },
      },
    },
    async (request, reply) =>
      reply
        .status(HTTP_STATUS.created)
        .send(
          await requireService(options.recipeCoachService).answer(
            requireCurrentUser(request).id,
            request.body,
          ),
        ),
  );

  await Promise.resolve();
};
