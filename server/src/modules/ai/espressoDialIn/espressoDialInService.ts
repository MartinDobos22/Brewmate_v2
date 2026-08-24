import {
  BREW_METHOD_CATEGORIES,
  CHAT_ROLES,
  DIAL_IN_HISTORY_SHOTS,
  TASTE_PROFILE_SOURCES,
  type BrewConstraints,
  type BrewLog,
  type EspressoDialInRequest,
  type EspressoDialInResponse,
  type Recipe,
  type RecipeChatMessage,
  type RecipePatch,
  type ShotSource,
} from '@brewmate/shared';

import { AI_CHAT_MAX_TOKENS, AI_EFFORT_LEVELS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { badRequestError } from '../../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { toBrewLog } from '../../brewLogs/brewLogMapper.js';
import type { BrewLogRepository } from '../../brewLogs/brewLogRepository.js';
import type { BrewLogService } from '../../brewLogs/brewLogService.js';
import type { BrewMethodService } from '../../brewMethods/brewMethodService.js';
import type { RecipeChatService } from '../../recipeChat/recipeChatService.js';
import { toRecipe } from '../../recipes/recipeMapper.js';
import type { RecipeRepository } from '../../recipes/recipeRepository.js';
import type { RecipeService } from '../../recipes/recipeService.js';
import type { TasteProfileService } from '../../tasteProfiles/tasteProfileService.js';
import type { BrewContextResolver } from '../brewContext/brewContextResolver.js';
import { describeTasteProfile } from '../coffeeEvaluation/describeTasteProfile.js';
import { completeJson } from '../completeJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';
import { describeCoffeeForBrew } from '../recipeEngine/describeCoffeeForBrew.js';
import { describeConstraints } from '../recipeEngine/describeConstraints.js';
import { describeGear } from '../recipeEngine/describeGear.js';
import { recordJsonUsage } from '../recordJsonUsage.js';

import { resolveDialInAnswerSchema, type DialInAnswer } from './dialInAnswerSchema.js';
import { DIAL_IN_CLOSING_INSTRUCTION, DIAL_IN_SYSTEM_PROMPT } from './dialInPrompt.js';
import { describeShots } from './describeShots.js';
import { toDialInPatch } from './toDialInPatch.js';

const FIRST_PAGE = 0;
const NOTHING = 0;
const NOTHING_MISSING: BrewConstraints = {};
/** Deep enough to reach the start of any dial-in worth calling one. */
const CHAIN_DEPTH = 12;

/** Whether an observation carries anything the profile fold can use. */
const teachesSomething = (observation: NonNullable<DialInAnswer['tasteObservation']>): boolean =>
  Object.keys(observation.axes).length > NOTHING ||
  Object.keys(observation.flavorAffinities ?? {}).length > NOTHING;

export interface EspressoDialInDependencies {
  readonly completionClient: TextCompletionClient;
  readonly recipeService: RecipeService;
  readonly recipeRepository: RecipeRepository;
  readonly recipeChatService: RecipeChatService;
  readonly brewLogService: BrewLogService;
  readonly brewLogRepository: BrewLogRepository;
  readonly brewMethodService: BrewMethodService;
  readonly brewContextResolver: BrewContextResolver;
  readonly tasteProfileService: TasteProfileService;
  readonly aiUsageService: AiUsageService;
}

export interface EspressoDialInService {
  answer(userId: string, input: EspressoDialInRequest): Promise<EspressoDialInResponse>;
}

/**
 * Dialling in a new coffee on an espresso machine.
 *
 * The conversation the recipe coach already runs, narrowed until it can only
 * do one thing per turn. Everything that makes this different from the general
 * chat is a narrowing: the answer schema admits exactly one change, the
 * history is the run of shots rather than the run of sentences, and the target
 * being aimed at is a shot time rather than a description of a cup.
 *
 * The shot is recorded before the model is asked anything. A dial-in is a
 * sequence and its value is entirely in the sequence - a shot that was pulled
 * but never written down because a request failed is a hole in the one thing
 * the next answer reasons about.
 */
export const createEspressoDialInService = ({
  completionClient,
  recipeService,
  recipeRepository,
  recipeChatService,
  brewLogService,
  brewLogRepository,
  brewMethodService,
  brewContextResolver,
  tasteProfileService,
  aiUsageService,
}: EspressoDialInDependencies): EspressoDialInService => {
  /**
   * The recipes this dial-in has been through, oldest first.
   *
   * Walked one parent at a time through the repository rather than joined,
   * because each hop is scoped to the caller: a recipe somebody else owns is
   * simply not found, and the chain stops there instead of leaking a row.
   */
  const readChain = async (userId: string, recipe: Recipe): Promise<readonly Recipe[]> => {
    const chain: Recipe[] = [recipe];
    let parentId = recipe.parentRecipeId;

    while (parentId !== null && chain.length < CHAIN_DEPTH) {
      const row = await recipeRepository.findById(parentId, userId);

      if (row === null) {
        break;
      }

      const parent = toRecipe(row);

      chain.unshift(parent);
      parentId = parent.parentRecipeId;
    }

    return chain;
  };

  /**
   * Every shot pulled in this dial-in, oldest first.
   *
   * Read per recipe in the chain rather than by coffee, because a dial-in is
   * the chain: the same bag brewed on a different machine last month is a
   * different exercise, and shots from it would push this morning's run out of
   * the window the answer sees.
   */
  const readShots = async (
    userId: string,
    chain: readonly Recipe[],
  ): Promise<readonly ShotSource[]> => {
    const perRecipe = await Promise.all(
      chain.map(async (recipe: Recipe): Promise<readonly ShotSource[]> => {
        const logs = await brewLogRepository.list({
          userId,
          limit: DIAL_IN_HISTORY_SHOTS,
          offset: FIRST_PAGE,
          recipeId: recipe.id,
        });

        return logs
          .map(toBrewLog)
          .map((log: BrewLog): ShotSource => ({ log, grindSetting: recipe.params.grindSetting }));
      }),
    );

    return perRecipe
      .flat()
      .sort((left: ShotSource, right: ShotSource): number =>
        left.log.createdAt.localeCompare(right.log.createdAt),
      )
      .slice(-DIAL_IN_HISTORY_SHOTS);
  };

  const teachProfile = async (
    userId: string,
    answer: DialInAnswer,
    message: RecipeChatMessage,
    shot: BrewLog,
  ): Promise<void> => {
    const observation = answer.tasteObservation;

    if (observation === null || !teachesSomething(observation)) {
      return;
    }

    await tasteProfileService.addEvent(userId, {
      source: TASTE_PROFILE_SOURCES.brewChat,
      sourceRef: message.id,
      /**
       * The shot's own learning weight, priced from its constraints on the way
       * in. A dial-in run on a machine with no way to weigh the yield teaches
       * less about somebody's taste than one run on a scale, and recomputing
       * it here would let that difference quietly disappear.
       */
      payload: { ...observation, weight: shot.profileLearningWeight },
    });
  };

  return {
    answer: async (userId, input): Promise<EspressoDialInResponse> => {
      const recipe = await recipeService.requireOwned(userId, input.recipeId);
      const method = await brewMethodService.requireUsable(recipe.methodId);

      if (method.category !== BREW_METHOD_CATEGORIES.espresso) {
        throw badRequestError(ERROR_MESSAGES.espressoDialInMethodMismatch);
      }

      const constraints = recipe.params.constraints ?? NOTHING_MISSING;
      /**
       * The shot goes into the record before anything else happens. A cup that
       * was pulled is never lost to a model call that failed afterwards - the
       * same rule brew mode follows, for the same reason.
       */
      const shot = await brewLogService.create(userId, {
        recipeId: recipe.id,
        constraints,
        waterType: recipe.params.waterType,
        durationSeconds: input.shot.timeSeconds,
        actualParams: {
          doseGrams: input.shot.doseGrams ?? recipe.params.doseGrams,
          waterGrams: input.shot.yieldGrams,
          totalTimeSeconds: input.shot.timeSeconds,
          grindSetting: recipe.params.grindSetting,
        },
      });

      const chain = await readChain(userId, recipe);
      const [context, shots] = await Promise.all([
        brewContextResolver.resolve({
          userId,
          method,
          bagId: recipe.bagId,
          equipmentSetId: shot.equipmentSetId,
          equipmentIds: recipe.equipmentIds,
        }),
        readShots(userId, chain),
      ]);

      const userMessage = await recipeChatService.append(userId, recipe.id, {
        role: CHAT_ROLES.user,
        content: input.message,
      });

      const sections = [
        describeTasteProfile(context.profile),
        describeCoffeeForBrew(context.bag, null, new Date()),
        describeGear({ method, equipment: context.equipment, grinder: context.grinder }),
        describeShots(shots),
        describeConstraints(constraints),
        `What they said about the shot they have just pulled: ${input.message}`,
        DIAL_IN_CLOSING_INSTRUCTION,
      ];

      const completion = await completeJson<DialInAnswer>({
        client: completionClient,
        schema: resolveDialInAnswerSchema(constraints),
        system: DIAL_IN_SYSTEM_PROMPT,
        prompt: sections.join(PROMPT_SECTION_SEPARATOR),
        maxTokens: AI_CHAT_MAX_TOKENS,
        effort: AI_EFFORT_LEVELS.medium,
      }).catch((cause: unknown): never => {
        throw serviceUnavailableError(ERROR_MESSAGES.espressoDialInUnavailable, cause);
      });

      await recordJsonUsage(aiUsageService, {
        userId,
        functionName: AI_FUNCTION_NAMES.espressoDialIn,
        completion,
      });

      const patch: RecipePatch | null = toDialInPatch(completion.value, recipe.params);
      const assistantMessage = await recipeChatService.append(userId, recipe.id, {
        role: CHAT_ROLES.assistant,
        content: completion.value.reply,
        recipePatch: patch,
      });

      await teachProfile(userId, completion.value, assistantMessage, shot);

      return { shot, userMessage, assistantMessage };
    },
  };
};
