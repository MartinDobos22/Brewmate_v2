import {
  estimateCoffeeTaste,
  matchCoffeeToProfile,
  readCoffeeSignals,
  toModelSignal,
  type BagEvaluation,
  type CoffeeMatch,
  type CoffeeTasteSignal,
  type EvaluateCoffeeRequest,
  type EvaluateCoffeeResponse,
  type ParsedBagData,
  type TasteProfile,
} from '@brewmate/shared';

import { AI_EFFORT_LEVELS, AI_VERDICT_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import { toBagEvaluation } from '../../bagEvaluations/bagEvaluationMapper.js';
import type { BagEvaluationRepository } from '../../bagEvaluations/bagEvaluationRepository.js';
import type { BagEvaluationService } from '../../bagEvaluations/bagEvaluationService.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import type { TasteProfileService } from '../../tasteProfiles/tasteProfileService.js';
import { completeBilledJson } from '../completeBilledJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_HISTORY_LIMIT, PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';
import { normalizeLabelKey } from '../coffeeBagParse/normalizeLabelKey.js';

import type { CoffeeTasteReadingRepository } from '../coffeeTasteEstimate/coffeeTasteReadingRepository.js';

import { coffeeVerdictSchema, type CoffeeVerdict } from './coffeeVerdictSchema.js';
import { COFFEE_VERDICT_SYSTEM_PROMPT } from './coffeeVerdictPrompt.js';
import { describeCoffee } from './describeCoffee.js';
import { describeCoffeeMatch } from './describeCoffeeMatch.js';
import { describeHistory } from './describeHistory.js';
import { describeTasteProfile } from './describeTasteProfile.js';

const FIRST_PAGE = 0;
const FROM_HISTORY = true;
const WRITTEN_NOW = false;
const CLOSING_INSTRUCTION =
  'Write the verdict for this coffee and this person now, following your instructions exactly.';

export interface CoffeeEvaluationDependencies {
  readonly completionClient: TextCompletionClient;
  readonly repository: BagEvaluationRepository;
  readonly bagEvaluationService: BagEvaluationService;
  readonly tasteProfileService: TasteProfileService;
  /** Read-only here: the verdict uses a reading that exists, never buys one. */
  readonly tasteReadingRepository: CoffeeTasteReadingRepository;
  readonly aiUsageService: AiUsageService;
}

export interface CoffeeEvaluationService {
  evaluate(userId: string, input: EvaluateCoffeeRequest): Promise<EvaluateCoffeeResponse>;
}

/**
 * "Mám si ju kúpiť?", answered.
 *
 * The profile, its confidence, the brew count and the history all come from
 * the caller's own rows rather than from the request. A profile a client could
 * declare would be a profile anybody could declare, and the one thing that
 * makes this verdict worth reading is that it is about this person.
 *
 * A coffee this account has already been advised about is answered from that
 * verdict instead of a new one. Partly cost, mostly consistency: advice that
 * comes out differently every time somebody asks is advice nobody can rely on.
 */
export const createCoffeeEvaluationService = ({
  completionClient,
  repository,
  bagEvaluationService,
  tasteProfileService,
  tasteReadingRepository,
  aiUsageService,
}: CoffeeEvaluationDependencies): CoffeeEvaluationService => {
  /**
   * The coffee on the same five axes as the person, held up against them.
   *
   * The estimate is arithmetic and costs nothing, so it always runs. A model's
   * reading of this label is folded in only if one has already been bought and
   * cached - the verdict never buys one itself.
   *
   * Which is not the same as saying a scan is two calls. The app asks for the
   * closer reading first and waits for it, precisely so this verdict has it to
   * argue from, and that reading is cached per coffee rather than per person -
   * so the cost is paid once for a bag and shared by everybody who picks it up
   * afterwards. What this rule stops is a *second* reading bought here, on a
   * label the scan has already read, which would spend an allowance on an
   * answer already sitting in the table next door.
   */
  const matchAgainstProfile = async (
    coffee: ParsedBagData,
    profile: TasteProfile,
  ): Promise<CoffeeMatch> => {
    const roasterKey = normalizeLabelKey(coffee.roaster);
    const nameKey = normalizeLabelKey(coffee.name);
    const cached =
      roasterKey === null || nameKey === null
        ? null
        : await tasteReadingRepository.findByLabel({ roasterKey, nameKey });
    const signals: readonly CoffeeTasteSignal[] = [
      ...readCoffeeSignals(coffee),
      ...(cached === null ? [] : [toModelSignal(cached.reading)]),
    ];

    return matchCoffeeToProfile(estimateCoffeeTaste(signals), {
      acidity: profile.acidity,
      sweetness: profile.sweetness,
      body: profile.body,
      bitterness: profile.bitterness,
      intensity: profile.intensity,
      axisConfidence: profile.axisConfidence,
      milkUsage: profile.milkUsage,
    });
  };

  const findEarlierVerdict = async (
    userId: string,
    coffee: ParsedBagData,
  ): Promise<BagEvaluation | null> => {
    const roasterKey = normalizeLabelKey(coffee.roaster);
    const nameKey = normalizeLabelKey(coffee.name);

    if (roasterKey === null || nameKey === null) {
      return null;
    }

    const row = await repository.findByCoffee(userId, { roasterKey, nameKey });

    return row === null ? null : toBagEvaluation(row);
  };

  const writeVerdict = async (
    userId: string,
    coffee: ParsedBagData,
    profile: TasteProfile,
    history: readonly BagEvaluation[],
    match: CoffeeMatch,
  ): Promise<CoffeeVerdict> => {
    const sections = [
      describeTasteProfile(profile),
      describeCoffee(coffee, new Date()),
      describeCoffeeMatch(match),
      describeHistory(history),
      CLOSING_INSTRUCTION,
    ].filter((section: string | null): section is string => section !== null);

    const completion = await completeBilledJson({
      aiUsageService,
      userId,
      client: completionClient,
      schema: coffeeVerdictSchema,
      functionName: AI_FUNCTION_NAMES.evaluateCoffee,
      system: COFFEE_VERDICT_SYSTEM_PROMPT,
      prompt: sections.join(PROMPT_SECTION_SEPARATOR),
      maxTokens: AI_VERDICT_MAX_TOKENS,
      effort: AI_EFFORT_LEVELS.medium,
    }).catch((cause: unknown): never => {
      throw serviceUnavailableError(ERROR_MESSAGES.coffeeVerdictUnavailable, cause);
    });

    return completion.value;
  };

  return {
    evaluate: async (userId, input): Promise<EvaluateCoffeeResponse> => {
      const earlier = await findEarlierVerdict(userId, input.parsedData);

      if (earlier !== null) {
        return { evaluation: earlier, fromHistory: FROM_HISTORY };
      }

      const [profile, history] = await Promise.all([
        tasteProfileService.get(userId),
        repository.list({ userId, limit: PROMPT_HISTORY_LIMIT, offset: FIRST_PAGE }),
      ]);
      const verdict = await writeVerdict(
        userId,
        input.parsedData,
        profile,
        history.map(toBagEvaluation),
        await matchAgainstProfile(input.parsedData, profile),
      );

      return {
        evaluation: await bagEvaluationService.create(userId, {
          imageUrl: input.imageUrl ?? null,
          parsedData: input.parsedData,
          verdictText: verdict.verdictText,
          reasoning: { points: verdict.reasoning },
          uncertainties: { items: verdict.uncertainties },
        }),
        fromHistory: WRITTEN_NOW,
      };
    },
  };
};
