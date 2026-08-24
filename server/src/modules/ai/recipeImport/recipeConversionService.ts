import {
  RECIPE_SOURCES,
  convertRecipe,
  type ConvertRecipeRequest,
  type ConvertRecipeResponse,
  type Grinder,
} from '@brewmate/shared';

import { AI_EFFORT_LEVELS, AI_RECIPE_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import type { BrewMethodService } from '../../brewMethods/brewMethodService.js';
import { toGrinder } from '../../grinders/grinderMapper.js';
import type { GrinderRepository } from '../../grinders/grinderRepository.js';
import type { RecipeService } from '../../recipes/recipeService.js';
import type { BrewContextResolver } from '../brewContext/brewContextResolver.js';
import { completeJson } from '../completeJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';
import { describeCoffeeForBrew } from '../recipeEngine/describeCoffeeForBrew.js';
import { describeConstraints } from '../recipeEngine/describeConstraints.js';
import { describeGear } from '../recipeEngine/describeGear.js';
import { describeWater } from '../recipeEngine/describeBrew.js';
import { recordJsonUsage } from '../recordJsonUsage.js';

import { resolveConversionAnswerSchema, type ConversionAnswer } from './conversionAnswerSchema.js';
import { CONVERSION_CLOSING_INSTRUCTION, CONVERSION_SYSTEM_PROMPT } from './conversionPrompt.js';
import { describeConversionResult, describeSourceRecipe } from './describeConversion.js';
import { resolveConversionTarget } from './resolveConversionTarget.js';
import { toConvertedBrewParams } from './toConvertedBrewParams.js';

const NO_PARENT = null;
const NOT_SAVED = false;
const NOT_PINNED = false;

export interface RecipeConversionDependencies {
  readonly completionClient: TextCompletionClient;
  readonly brewMethodService: BrewMethodService;
  readonly brewContextResolver: BrewContextResolver;
  readonly grinderRepository: GrinderRepository;
  readonly recipeService: RecipeService;
  readonly aiUsageService: AiUsageService;
}

export interface RecipeConversionService {
  convert(userId: string, input: ConvertRecipeRequest): Promise<ConvertRecipeResponse>;
}

/**
 * Somebody else's recipe, on this person's equipment.
 *
 * The order of operations is the whole design. The arithmetic runs first, in
 * `@brewmate/shared`, over the two grinders' calibration curves and this
 * person's brewer - and it runs whether or not a model is reachable, produces
 * the same answer every time, and has its own unit tests. Only then is a model
 * asked for the two things arithmetic cannot do: the grind in words somebody
 * can act on, and an explanation that says which numbers are exact and which
 * are a place to start.
 *
 * That order is what makes the feature honest. A model asked to convert 22
 * clicks on a Comandante into a setting on a JX-Pro will produce a confident
 * number, and nobody - including the model - can say where it came from. The
 * conversion here can always say: through microns, along these two curves, one
 * of which is a manufacturer's estimate.
 *
 * The recipe is stored before the response leaves, as `imported`, for the same
 * reason a generated one is: everything downstream needs an id to point at.
 */
export const createRecipeConversionService = ({
  completionClient,
  brewMethodService,
  brewContextResolver,
  grinderRepository,
  recipeService,
  aiUsageService,
}: RecipeConversionDependencies): RecipeConversionService => {
  /**
   * The catalogue entry for the grinder the source recipe was written on.
   *
   * Read through the same visibility rule as everything else in the
   * catalogue - a contributed entry belongs to the person who contributed it -
   * and a miss is an ordinary outcome rather than an error. Without it the
   * grind is recovered from the words the recipe used, and the report says so.
   */
  const readSourceGrinder = async (
    userId: string,
    grinderId: string | null,
  ): Promise<Grinder | null> => {
    if (grinderId === null) {
      return null;
    }

    const row = await grinderRepository.findVisible(grinderId, userId);

    return row === null ? null : toGrinder(row);
  };

  return {
    convert: async (userId, input): Promise<ConvertRecipeResponse> => {
      const method = await brewMethodService.requireUsable(input.methodId);
      const bagId = input.bagId ?? null;
      const [context, sourceGrinder] = await Promise.all([
        brewContextResolver.resolve({
          userId,
          method,
          bagId,
          equipmentSetId: input.equipmentSetId ?? null,
        }),
        readSourceGrinder(userId, input.source.grinderId),
      ]);

      const target = resolveConversionTarget({
        method,
        equipment: context.equipment,
        grinder: context.grinder,
        constraints: input.constraints,
      });
      /**
       * The whole conversion, before a model has been asked anything. What
       * follows is an explanation of this, never a negotiation with it.
       */
      const result = convertRecipe(input.source, sourceGrinder, target);

      const sections = [
        describeCoffeeForBrew(context.bag, input.coffeeDescription ?? null, new Date()),
        describeGear({ method, equipment: context.equipment, grinder: context.grinder }),
        describeSourceRecipe(input.source),
        describeConversionResult(result),
        describeWater(input.waterType),
        describeConstraints(input.constraints),
        CONVERSION_CLOSING_INSTRUCTION,
      ];

      const completion = await completeJson<ConversionAnswer>({
        client: completionClient,
        schema: resolveConversionAnswerSchema({ result, targetCategory: method.category }),
        functionName: AI_FUNCTION_NAMES.convertRecipe,
        system: CONVERSION_SYSTEM_PROMPT,
        prompt: sections.join(PROMPT_SECTION_SEPARATOR),
        maxTokens: AI_RECIPE_MAX_TOKENS,
        effort: AI_EFFORT_LEVELS.medium,
      }).catch((cause: unknown): never => {
        throw serviceUnavailableError(ERROR_MESSAGES.recipeConversionUnavailable, cause);
      });

      await recordJsonUsage(aiUsageService, { userId, completion });

      return {
        recipe: await recipeService.create(userId, {
          bagId,
          methodId: method.id,
          equipmentIds: context.equipment.map((item): string => item.id),
          params: toConvertedBrewParams(result, completion.value, {
            source: input.source,
            waterType: input.waterType,
            constraints: input.constraints,
            targetCategory: method.category,
          }),
          rationale: completion.value.rationale,
          source: RECIPE_SOURCES.imported,
          parentRecipeId: NO_PARENT,
          isSaved: NOT_SAVED,
          isPinned: NOT_PINNED,
        }),
      };
    },
  };
};
