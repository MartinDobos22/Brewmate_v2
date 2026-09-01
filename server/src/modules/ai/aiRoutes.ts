import {
  API_ROUTES,
  convertRecipeRequestSchema,
  convertRecipeResponseSchema,
  errorResponseSchema,
  espressoDialInRequestSchema,
  espressoDialInResponseSchema,
  estimateCoffeeTasteRequestSchema,
  estimateCoffeeTasteResponseSchema,
  evaluateCoffeeRequestSchema,
  evaluateCoffeeResponseSchema,
  generateRecipeRequestSchema,
  generateRecipeResponseSchema,
  parseCoffeeBagRequestSchema,
  parseCoffeeBagResponseSchema,
  parseRecipeRequestSchema,
  parseRecipeResponseSchema,
  recipeChatRequestSchema,
  recipeChatResponseSchema,
} from '@brewmate/shared';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { requireCurrentUser } from '../../auth/requireCurrentUser.js';
import { HTTP_STATUS } from '../../constants/httpStatus.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../aiUsage/aiUsageService.js';

import type { CoffeeBagParseService } from './coffeeBagParse/coffeeBagParseService.js';
import type { CoffeeEvaluationService } from './coffeeEvaluation/coffeeEvaluationService.js';
import type { CoffeeTasteEstimateService } from './coffeeTasteEstimate/coffeeTasteEstimateService.js';
import type { EspressoDialInService } from './espressoDialIn/espressoDialInService.js';
import type { RecipeConversionService } from './recipeImport/recipeConversionService.js';
import type { RecipeParseService } from './recipeImport/recipeParseService.js';
import type { RecipeCoachService } from './recipeCoach/recipeCoachService.js';
import type { RecipeGenerationService } from './recipeEngine/recipeGenerationService.js';

export interface AiRoutesOptions {
  /** Reads the caller's spending; the only thing standing in front of these routes. */
  readonly aiUsageService: AiUsageService;
  /** Null wherever no model provider is configured; every route then answers 503. */
  readonly coffeeBagParseService: CoffeeBagParseService | null;
  readonly coffeeEvaluationService: CoffeeEvaluationService | null;
  readonly coffeeTasteEstimateService: CoffeeTasteEstimateService | null;
  readonly recipeGenerationService: RecipeGenerationService | null;
  readonly recipeCoachService: RecipeCoachService | null;
  readonly recipeParseService: RecipeParseService | null;
  readonly recipeConversionService: RecipeConversionService | null;
  readonly espressoDialInService: EspressoDialInService | null;
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
  /**
   * The allowance is checked once, here, in front of every route in this file
   * and in front of no route anywhere else.
   *
   * A hook rather than a line in each of the seven handlers, because the rule
   * is "the routes that cost money", and a handler that forgot the line would
   * be a hole nobody notices until an invoice. It runs after `authenticate`,
   * so the caller is already resolved - and it deliberately does not run for
   * `/brew-logs`, `/recipes`, `/coffee-bags` or anything else: an account over
   * its limit can still brew from a stored recipe, add a bag by hand and read
   * its whole history.
   */
  const withinLimits = async (request: Parameters<typeof requireCurrentUser>[0]): Promise<void> => {
    await options.aiUsageService.assertWithinLimits(requireCurrentUser(request).id);
  };

  app.addHook('preHandler', withinLimits);

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

  /**
   * What is in the bag, rather than whether to buy it.
   *
   * Its own route rather than a field on the verdict, because the two answer
   * different questions and are wanted in different places: a coffee already
   * in the cupboard has a taste and no verdict, and a coffee on a shelf wants
   * both. Nothing about the caller reaches the estimate, which is what lets
   * one reading be cached and shared - the same bag tastes the same for
   * everybody, and only the verdict is personal.
   */
  app.post(
    API_ROUTES.aiEstimateCoffeeTaste,
    {
      onRequest: app.authenticate,
      schema: {
        body: estimateCoffeeTasteRequestSchema,
        response: {
          [HTTP_STATUS.ok]: estimateCoffeeTasteResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      requireService(options.coffeeTasteEstimateService).estimate(
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

  app.post(
    API_ROUTES.aiParseRecipe,
    {
      onRequest: app.authenticate,
      schema: {
        body: parseRecipeRequestSchema,
        response: {
          [HTTP_STATUS.ok]: parseRecipeResponseSchema,
          [HTTP_STATUS.badRequest]: errorResponseSchema,
          [HTTP_STATUS.unauthorized]: errorResponseSchema,
          [HTTP_STATUS.unprocessableEntity]: errorResponseSchema,
          [HTTP_STATUS.serviceUnavailable]: errorResponseSchema,
        },
      },
    },
    async (request) =>
      requireService(options.recipeParseService).parse(
        requireCurrentUser(request).id,
        request.body,
      ),
  );

  app.post(
    API_ROUTES.aiConvertRecipe,
    {
      onRequest: app.authenticate,
      schema: {
        body: convertRecipeRequestSchema,
        response: {
          [HTTP_STATUS.created]: convertRecipeResponseSchema,
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
          await requireService(options.recipeConversionService).convert(
            requireCurrentUser(request).id,
            request.body,
          ),
        ),
  );

  app.post(
    API_ROUTES.aiEspressoDialIn,
    {
      onRequest: app.authenticate,
      schema: {
        body: espressoDialInRequestSchema,
        response: {
          [HTTP_STATUS.created]: espressoDialInResponseSchema,
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
          await requireService(options.espressoDialInService).answer(
            requireCurrentUser(request).id,
            request.body,
          ),
        ),
  );

  await Promise.resolve();
};
