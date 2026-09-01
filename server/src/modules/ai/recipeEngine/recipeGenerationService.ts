import {
  RECIPE_SOURCES,
  type BrewLog,
  type GenerateRecipeRequest,
  type GenerateRecipeResponse,
  type Recipe,
} from '@brewmate/shared';

import { AI_EFFORT_LEVELS, AI_RECIPE_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { toBrewLog } from '../../brewLogs/brewLogMapper.js';
import type { BrewLogRepository } from '../../brewLogs/brewLogRepository.js';
import type { BrewMethodService } from '../../brewMethods/brewMethodService.js';
import { toRecipe } from '../../recipes/recipeMapper.js';
import type { RecipeRepository } from '../../recipes/recipeRepository.js';
import type { RecipeService } from '../../recipes/recipeService.js';
import type { BrewContextResolver } from '../brewContext/brewContextResolver.js';
import { completeBilledJson } from '../completeBilledJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';
import { describeTasteProfile } from '../coffeeEvaluation/describeTasteProfile.js';

import { describeBrewHistory, type BrewHistoryEntry } from './describeBrewHistory.js';
import { describeChosenAmounts } from './describeBrew.js';
import { describeCoffeeForBrew } from './describeCoffeeForBrew.js';
import { describeConstraints } from './describeConstraints.js';
import { describeGear } from './describeGear.js';
import { resolveGeneratedRecipeSchema, type GeneratedRecipe } from './generatedRecipeSchema.js';
import { RECIPE_SYSTEM_PROMPT } from './recipePrompt.js';
import { toBrewParams } from './toBrewParams.js';

const FIRST_PAGE = 0;
const NO_PARENT = null;
const NOT_SAVED = false;
const NOT_PINNED = false;
const LOGS_PER_RECIPE = 5;
const CLOSING_INSTRUCTION =
  'Write the recipe for this coffee, this brewer and this person now, following your instructions exactly.';

/**
 * How many earlier attempts at this coffee in this brewer travel with a
 * request.
 *
 * Four, because that is roughly how many it takes to see a direction - a run
 * of grinds getting finer means something a single previous cup does not - and
 * few enough that a bag somebody has brewed twenty times does not crowd out
 * the coffee itself.
 */
const HISTORY_RECIPES = 4;

export interface RecipeGenerationDependencies {
  readonly completionClient: TextCompletionClient;
  readonly brewMethodService: BrewMethodService;
  readonly brewContextResolver: BrewContextResolver;
  readonly recipeRepository: RecipeRepository;
  readonly brewLogRepository: BrewLogRepository;
  readonly recipeService: RecipeService;
  readonly aiUsageService: AiUsageService;
}

export interface RecipeGenerationService {
  generate(userId: string, input: GenerateRecipeRequest): Promise<GenerateRecipeResponse>;
}

/**
 * The recipe engine.
 *
 * Everything about the person, the coffee and the kitchen is read off their
 * own rows; the only things the request carries are the decisions somebody
 * made on the screen before this one. Those decisions come back untouched -
 * the answer schema has no field for a dose or a water weight, so a model that
 * disagrees has to say so in the rationale rather than quietly winning the
 * argument.
 *
 * The recipe is stored before the response leaves. Everything downstream needs
 * an id to point at: brew mode logs against it, the conversation hangs off it,
 * and an adjustment becomes its child. It is stored unsaved and unpinned -
 * a proposal is not yet a favourite, and somebody who brews and walks away
 * should not find their cupboard filling up with recipes they never chose.
 */
export const createRecipeGenerationService = ({
  completionClient,
  brewMethodService,
  brewContextResolver,
  recipeRepository,
  brewLogRepository,
  recipeService,
  aiUsageService,
}: RecipeGenerationDependencies): RecipeGenerationService => {
  /**
   * What was tried for this pair before, with the cups it actually produced.
   *
   * A recipe nobody brewed and a recipe brewed four times are different kinds
   * of evidence, so the logs are read per recipe rather than counted in the
   * aggregate.
   */
  const readHistory = async (
    userId: string,
    bagId: string | null,
    methodId: string,
  ): Promise<readonly BrewHistoryEntry[]> => {
    if (bagId === null) {
      return [];
    }

    const recipes = (
      await recipeRepository.list({
        userId,
        limit: HISTORY_RECIPES,
        offset: FIRST_PAGE,
        bagId,
        methodId,
      })
    ).map(toRecipe);

    return Promise.all(
      recipes.map(async (recipe: Recipe): Promise<BrewHistoryEntry> => {
        const logs = await brewLogRepository.list({
          userId,
          limit: LOGS_PER_RECIPE,
          offset: FIRST_PAGE,
          recipeId: recipe.id,
        });

        return { recipe, logs: logs.map((log): BrewLog => toBrewLog(log)) };
      }),
    );
  };

  return {
    generate: async (userId, input): Promise<GenerateRecipeResponse> => {
      const method = await brewMethodService.requireUsable(input.methodId);
      const bagId = input.bagId ?? null;
      const context = await brewContextResolver.resolve({
        userId,
        method,
        bagId,
        equipmentSetId: input.equipmentSetId ?? null,
      });
      const history = await readHistory(userId, bagId, method.id);

      const sections = [
        describeTasteProfile(context.profile),
        describeCoffeeForBrew(context.bag, input.coffeeDescription ?? null, new Date()),
        describeGear({ method, equipment: context.equipment, grinder: context.grinder }),
        describeChosenAmounts({
          doseGrams: input.doseGrams,
          waterGrams: input.waterGrams,
          ratio: input.ratio,
          waterType: input.waterType,
        }),
        describeConstraints(input.constraints),
        describeBrewHistory(history),
        CLOSING_INSTRUCTION,
      ].filter((section: string | null): section is string => section !== null);

      const completion = await completeBilledJson<GeneratedRecipe>({
        aiUsageService,
        userId,
        client: completionClient,
        schema: resolveGeneratedRecipeSchema(method.category),
        functionName: AI_FUNCTION_NAMES.generateRecipe,
        system: RECIPE_SYSTEM_PROMPT,
        prompt: sections.join(PROMPT_SECTION_SEPARATOR),
        maxTokens: AI_RECIPE_MAX_TOKENS,
        effort: AI_EFFORT_LEVELS.medium,
      }).catch((cause: unknown): never => {
        throw serviceUnavailableError(ERROR_MESSAGES.recipeUnavailable, cause);
      });

      return {
        recipe: await recipeService.create(userId, {
          bagId,
          methodId: method.id,
          equipmentIds: context.equipment.map((item): string => item.id),
          params: toBrewParams(completion.value, {
            doseGrams: input.doseGrams,
            waterGrams: input.waterGrams,
            waterType: input.waterType,
            constraints: input.constraints,
          }),
          rationale: completion.value.rationale,
          source: RECIPE_SOURCES.ai,
          parentRecipeId: NO_PARENT,
          isSaved: NOT_SAVED,
          isPinned: NOT_PINNED,
        }),
      };
    },
  };
};
