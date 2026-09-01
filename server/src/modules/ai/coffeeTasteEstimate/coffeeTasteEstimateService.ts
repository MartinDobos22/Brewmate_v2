import {
  coffeeTasteReadingSchema,
  estimateCoffeeTaste,
  readCoffeeSignals,
  toModelSignal,
  type CoffeeTasteReading,
  type CoffeeTasteSignal,
  type EstimateCoffeeTasteRequest,
  type EstimateCoffeeTasteResponse,
  type ParsedBagData,
} from '@brewmate/shared';

import { AI_EFFORT_LEVELS, AI_PARSE_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { normalizeLabelKey } from '../coffeeBagParse/normalizeLabelKey.js';
import { completeJson } from '../completeJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';
import { describeCoffee } from '../coffeeEvaluation/describeCoffee.js';
import { recordJsonUsage } from '../recordJsonUsage.js';

import { COFFEE_TASTE_SYSTEM_PROMPT } from './coffeeTastePrompt.js';
import type { CoffeeTasteReadingRepository } from './coffeeTasteReadingRepository.js';

const NO_NOTES: string[] = [];
const CLOSING_INSTRUCTION = 'Read this label into axes now, following your instructions exactly.';

export interface CoffeeTasteEstimateDependencies {
  readonly completionClient: TextCompletionClient;
  readonly repository: CoffeeTasteReadingRepository;
  readonly aiUsageService: AiUsageService;
}

export interface CoffeeTasteEstimateService {
  estimate(userId: string, input: EstimateCoffeeTasteRequest): Promise<EstimateCoffeeTasteResponse>;
}

/**
 * What a coffee tastes like, from whatever the bag was willing to say.
 *
 * The estimate itself is arithmetic and always runs: the roast level, the
 * process, the origin, the altitude, the variety and every note the lexicon
 * recognises are folded into five axes with a confidence each, in code, with
 * no model involved. A bag carrying nothing but a country still comes back
 * with an answer, and a bag carrying a full label comes back with a good one.
 * That is the feature rather than a fallback - this is used standing in a shop
 * on one bar of signal, and something that only worked with a model and an
 * allowance would be missing exactly where it is needed.
 *
 * The model is asked for the part the tables cannot do: an unfamiliar note, a
 * region whose character a country name does not carry, a label in a language
 * no lexicon here covers. Its answer becomes one more weighted signal and then
 * has to survive the same fold as everything else, so it can never assert a
 * flavour over the label - where the two disagree the confidence falls, which
 * is the honest outcome.
 *
 * A reading is cached per coffee rather than per person, because the same bag
 * tastes the same for everybody. Only the model's reading is stored: the
 * tables re-fold on every read, so correcting a roast level on the form
 * changes the answer immediately instead of leaving a stale row behind.
 */
export const createCoffeeTasteEstimateService = ({
  completionClient,
  repository,
  aiUsageService,
}: CoffeeTasteEstimateDependencies): CoffeeTasteEstimateService => {
  const readLabel = async (
    userId: string,
    coffee: ParsedBagData,
  ): Promise<{ readonly reading: CoffeeTasteReading; readonly model: string }> => {
    const completion = await completeJson({
      client: completionClient,
      schema: coffeeTasteReadingSchema,
      functionName: AI_FUNCTION_NAMES.estimateCoffeeTaste,
      system: COFFEE_TASTE_SYSTEM_PROMPT,
      prompt: [describeCoffee(coffee, new Date()), CLOSING_INSTRUCTION].join(
        PROMPT_SECTION_SEPARATOR,
      ),
      maxTokens: AI_PARSE_MAX_TOKENS,
      effort: AI_EFFORT_LEVELS.medium,
    });

    await recordJsonUsage(aiUsageService, { userId, completion });

    return { reading: completion.value, model: completion.model };
  };

  /**
   * The model's reading, from the cache or from a call - and null wherever it
   * could not be had at all.
   *
   * A model that will not answer is not a failure here, because the tables
   * have already produced a complete estimate. Letting the call take the whole
   * request down with it would turn a richer answer into a missing one.
   */
  const resolveReading = async (
    userId: string,
    coffee: ParsedBagData,
  ): Promise<CoffeeTasteReading | null> => {
    const roasterKey = normalizeLabelKey(coffee.roaster);
    const nameKey = normalizeLabelKey(coffee.name);
    const key = roasterKey === null || nameKey === null ? null : { roasterKey, nameKey };
    const cached = key === null ? null : await repository.findByLabel(key);

    if (cached !== null) {
      return cached.reading;
    }

    const read = await readLabel(userId, coffee).catch((): null => null);

    if (read === null) {
      return null;
    }

    /**
     * A coffee whose roaster or name could not be read is estimated but never
     * cached: several unreadable labels are several different bags, and one
     * cache entry standing for all of them would hand somebody the wrong
     * coffee.
     */
    if (key !== null) {
      await repository.save({ ...key, reading: read.reading, model: read.model });
    }

    return read.reading;
  };

  return {
    estimate: async (userId, input): Promise<EstimateCoffeeTasteResponse> => {
      const reading = await resolveReading(userId, input.parsedData);
      const signals: readonly CoffeeTasteSignal[] = [
        ...readCoffeeSignals(input.parsedData),
        ...(reading === null ? [] : [toModelSignal(reading)]),
      ];

      return {
        estimate: estimateCoffeeTaste(signals),
        summary: reading?.summary ?? null,
        flavourNotes: reading?.flavourNotes ?? NO_NOTES,
      };
    },
  };
};
