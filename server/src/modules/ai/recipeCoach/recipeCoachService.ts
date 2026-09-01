import {
  CHAT_ROLES,
  RECIPE_CHAT_HISTORY_VERSIONS,
  TASTE_PROFILE_SOURCES,
  type BrewConstraints,
  type BrewLog,
  type Recipe,
  type RecipeChatMessage,
  type RecipeChatRequest,
  type RecipeChatResponse,
  type RecipePatch,
} from '@brewmate/shared';

import { AI_CHAT_MAX_TOKENS, AI_EFFORT_LEVELS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { badRequestError } from '../../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { toBrewLog } from '../../brewLogs/brewLogMapper.js';
import type { BrewLogRepository } from '../../brewLogs/brewLogRepository.js';
import { calculateLearningWeight } from '../../brewLogs/calculateLearningWeight.js';
import type { BrewMethodService } from '../../brewMethods/brewMethodService.js';
import type { RecipeChatService } from '../../recipeChat/recipeChatService.js';
import { toRecipe } from '../../recipes/recipeMapper.js';
import type { RecipeRepository } from '../../recipes/recipeRepository.js';
import type { RecipeService } from '../../recipes/recipeService.js';
import type { TasteProfileService } from '../../tasteProfiles/tasteProfileService.js';
import type { BrewContextResolver } from '../brewContext/brewContextResolver.js';
import { describeTasteProfile } from '../coffeeEvaluation/describeTasteProfile.js';
import { completeBilledJson } from '../completeBilledJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';
import { describeWater } from '../recipeEngine/describeBrew.js';
import { describeCoffeeForBrew } from '../recipeEngine/describeCoffeeForBrew.js';
import { describeConstraints } from '../recipeEngine/describeConstraints.js';
import { describeGear } from '../recipeEngine/describeGear.js';

import {
  resolveCoachAnswerSchema,
  type CoachAnswer,
  type CoachTasteObservation,
} from './coachAnswerSchema.js';
import { describeConversation, describeRecipeVersions } from './describeConversation.js';
import { RECIPE_COACH_SYSTEM_PROMPT } from './recipeCoachPrompt.js';
import { toRecipePatch } from './toRecipePatch.js';

const FIRST_PAGE = 0;
const NOTHING_MISSING: BrewConstraints = {};
const CONVERSATION_LIMIT = 20;
const CLOSING_INSTRUCTION =
  'Answer what they have just said now, following your instructions exactly.';
const NOTHING = 0;

/** Whether an observation carries anything the profile fold can use. */
const teachesSomething = (observation: CoachTasteObservation): boolean =>
  Object.keys(observation.axes).length > NOTHING ||
  Object.keys(observation.flavorAffinities ?? {}).length > NOTHING;

export interface RecipeCoachDependencies {
  readonly completionClient: TextCompletionClient;
  readonly recipeService: RecipeService;
  readonly recipeRepository: RecipeRepository;
  readonly recipeChatService: RecipeChatService;
  readonly brewLogRepository: BrewLogRepository;
  readonly brewMethodService: BrewMethodService;
  readonly brewContextResolver: BrewContextResolver;
  readonly tasteProfileService: TasteProfileService;
  readonly aiUsageService: AiUsageService;
}

export interface RecipeCoachService {
  answer(userId: string, input: RecipeChatRequest): Promise<RecipeChatResponse>;
}

/**
 * The conversation after the cup.
 *
 * This is where the product actually learns anything. A form with five sliders
 * would be easier to build and nobody would fill it in twice; "aké to bolo?"
 * gets answered because it is a question a person can answer while holding a
 * mug.
 *
 * Three rules hold it together. The suggestion has to be something this person
 * can carry out, which is enforced by the shape of the schema the answer is
 * validated against rather than by asking nicely. The patch is stored next to
 * the sentence that argued for it and applied only if somebody taps, so a
 * suggestion nobody took is still part of the record. And what the cup teaches
 * the profile is weighed by what the brew was worth: somebody complaining that
 * a cup was flat when they had no way to weigh anything is describing their
 * kitchen, not their taste.
 */
export const createRecipeCoachService = ({
  completionClient,
  recipeService,
  recipeRepository,
  recipeChatService,
  brewLogRepository,
  brewMethodService,
  brewContextResolver,
  tasteProfileService,
  aiUsageService,
}: RecipeCoachDependencies): RecipeCoachService => {
  /**
   * The chain of versions this recipe grew out of, newest first.
   *
   * Walked through the repository one parent at a time rather than joined,
   * because each hop is scoped to the caller: an ancestor somebody else owns
   * simply is not found, and the chain stops there instead of leaking a row.
   */
  const readVersions = async (userId: string, recipe: Recipe): Promise<readonly Recipe[]> => {
    const versions: Recipe[] = [recipe];
    let parentId = recipe.parentRecipeId;

    while (parentId !== null && versions.length < RECIPE_CHAT_HISTORY_VERSIONS) {
      const row = await recipeRepository.findById(parentId, userId);

      if (row === null) {
        return versions;
      }

      const parent = toRecipe(row);

      versions.push(parent);
      parentId = parent.parentRecipeId;
    }

    return versions;
  };

  /** The cup this conversation is about, checked to belong to this recipe. */
  const readBrewLog = async (
    userId: string,
    recipeId: string,
    brewLogId: string | null,
  ): Promise<BrewLog | null> => {
    if (brewLogId === null) {
      return null;
    }

    const row = await brewLogRepository.findById(brewLogId, userId);

    if (row === null) {
      throw badRequestError(ERROR_MESSAGES.brewLogNotFound);
    }

    const log = toBrewLog(row);

    if (log.recipeId !== recipeId) {
      throw badRequestError(ERROR_MESSAGES.recipeChatBrewMismatch);
    }

    return log;
  };

  /**
   * What this exchange is allowed to teach the profile.
   *
   * The brew's own learning weight, which was priced from its constraints on
   * the way in and stored - not recomputed here, because recomputing it would
   * mean a cup made at a cabin quietly gained authority the day somebody
   * corrected the record. A conversation with no cup behind it has no
   * constraints to discount, and counts as an ordinary remark.
   */
  const learningWeight = (log: BrewLog | null): number =>
    log === null ? calculateLearningWeight(NOTHING_MISSING) : log.profileLearningWeight;

  const teachProfile = async (
    userId: string,
    answer: CoachAnswer,
    message: RecipeChatMessage,
    log: BrewLog | null,
  ): Promise<void> => {
    const observation = answer.tasteObservation;

    /**
     * An observation that names no axis and no flavour is not an observation.
     * Storing it would add an event to the audit trail that the fold cannot
     * do anything with, and inflate the confidence figure with evidence that
     * says nothing.
     */
    if (observation === null || !teachesSomething(observation)) {
      return;
    }

    await tasteProfileService.addEvent(userId, {
      source: TASTE_PROFILE_SOURCES.brewChat,
      /**
       * The message it was drawn from, so what Brewmate concluded can always
       * be traced back to the sentence somebody actually wrote - and so one
       * exchange counts once however often the list is refetched.
       */
      sourceRef: message.id,
      payload: { ...observation, weight: learningWeight(log) },
    });
  };

  return {
    answer: async (userId, input): Promise<RecipeChatResponse> => {
      const recipe = await recipeService.requireOwned(userId, input.recipeId);
      const log = await readBrewLog(userId, recipe.id, input.brewLogId ?? null);
      /**
       * The cup's own constraints where there is a cup, and otherwise the
       * ones the recipe was written around. A conversation about a recipe
       * nobody has brewed yet still has to respect what its author said they
       * were missing - a suggestion to raise the temperature is no more use
       * before the brew than after it.
       */
      const constraints = log?.constraints ?? recipe.params.constraints ?? NOTHING_MISSING;
      const method = await brewMethodService.requireUsable(recipe.methodId);
      const [context, versions, conversation] = await Promise.all([
        brewContextResolver.resolve({
          userId,
          method,
          bagId: recipe.bagId,
          equipmentSetId: log?.equipmentSetId ?? null,
          equipmentIds: recipe.equipmentIds,
        }),
        readVersions(userId, recipe),
        recipeChatService.list(userId, recipe.id, {
          limit: CONVERSATION_LIMIT,
          offset: FIRST_PAGE,
        }),
      ]);

      /**
       * The question is written down before the answer is asked for, so a
       * model call that fails leaves the conversation holding what the person
       * said rather than swallowing it.
       */
      const userMessage = await recipeChatService.append(userId, recipe.id, {
        role: CHAT_ROLES.user,
        content: input.message,
      });

      const sections = [
        describeTasteProfile(context.profile),
        describeCoffeeForBrew(context.bag, null, new Date()),
        describeGear({ method, equipment: context.equipment, grinder: context.grinder }),
        /**
         * The recipe's own numbers are not repeated here as decisions that
         * cannot be touched: this conversation is allowed to move the dose and
         * the water, and telling the model otherwise while offering it those
         * fields would be two instructions that contradict each other. The
         * versions section below states them, in order, with their reasoning.
         */
        describeWater(recipe.params.waterType),
        describeConstraints(constraints),
        describeRecipeVersions(versions),
        describeConversation([...conversation.items, userMessage]),
        CLOSING_INSTRUCTION,
      ].filter((section: string | null): section is string => section !== null);

      const completion = await completeBilledJson<CoachAnswer>({
        aiUsageService,
        userId,
        client: completionClient,
        schema: resolveCoachAnswerSchema(constraints),
        functionName: AI_FUNCTION_NAMES.recipeChat,
        system: RECIPE_COACH_SYSTEM_PROMPT,
        prompt: sections.join(PROMPT_SECTION_SEPARATOR),
        maxTokens: AI_CHAT_MAX_TOKENS,
        effort: AI_EFFORT_LEVELS.medium,
      }).catch((cause: unknown): never => {
        throw serviceUnavailableError(ERROR_MESSAGES.recipeChatUnavailable, cause);
      });

      const patch: RecipePatch | null = toRecipePatch(completion.value, recipe.params);
      const assistantMessage = await recipeChatService.append(userId, recipe.id, {
        role: CHAT_ROLES.assistant,
        content: completion.value.reply,
        recipePatch: patch,
      });

      await teachProfile(userId, completion.value, assistantMessage, log);

      return { userMessage, assistantMessage };
    },
  };
};
