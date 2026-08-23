import {
  parsedBagFieldsSchema,
  type ParseCoffeeBagResponse,
  type ParsedBagFields,
} from '@brewmate/shared';

import { AI_ERROR_MESSAGES } from '../../../ai/aiErrorMessages.js';
import type { AiImage } from '../../../ai/aiImage.js';
import { AI_EFFORT_LEVELS, AI_PARSE_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import { estimateAiCost } from '../../../ai/estimateAiCost.js';
import type { ImageFetcher } from '../../../ai/imageFetcher.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { badRequestError } from '../../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { completeJson } from '../completeJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';

import { BAG_LABEL_PROMPT, BAG_LABEL_SYSTEM_PROMPT } from './bagLabelPrompt.js';
import type { CoffeeBagParseRepository } from './coffeeBagParseRepository.js';
import { normalizeLabelKey } from './normalizeLabelKey.js';

const FROM_CACHE = true;
const FRESHLY_READ = false;

/** What one reading produced, and which model produced it. */
interface LabelReading {
  readonly fields: ParsedBagFields;
  readonly model: string;
}

export interface CoffeeBagParseDependencies {
  readonly repository: CoffeeBagParseRepository;
  readonly imageFetcher: ImageFetcher;
  readonly completionClient: TextCompletionClient;
  readonly aiUsageService: AiUsageService;
}

export interface CoffeeBagParseService {
  parse(userId: string, imageUrl: string): Promise<ParseCoffeeBagResponse>;
}

/**
 * Reads a photographed label, once per label.
 *
 * Two things stand between a scan and a model call, in the order they can be
 * checked. The photograph's own hash catches the cheap case - a retry on a bad
 * signal, or the app asking twice - before anything is read at all. The
 * roaster-and-name pair catches the expensive one: the same coffee, in another
 * shop, photographed by somebody else, which is what makes the second scan of
 * a popular bag free for everybody.
 *
 * The label cache can only be consulted after the first reading, because the
 * roaster and the name have to be read before they can be looked up. That call
 * is not wasted - it is the call that fills the entry in.
 */
export const createCoffeeBagParseService = ({
  repository,
  imageFetcher,
  completionClient,
  aiUsageService,
}: CoffeeBagParseDependencies): CoffeeBagParseService => {
  const fetchImage = async (imageUrl: string): Promise<AiImage> => {
    try {
      return await imageFetcher.fetch(imageUrl);
    } catch (cause: unknown) {
      throw badRequestError(ERROR_MESSAGES.bagPhotoUnreadable, cause);
    }
  };

  const readLabel = async (userId: string, image: AiImage): Promise<LabelReading> => {
    const completion = await completeJson({
      client: completionClient,
      schema: parsedBagFieldsSchema,
      system: BAG_LABEL_SYSTEM_PROMPT,
      prompt: BAG_LABEL_PROMPT,
      image,
      maxTokens: AI_PARSE_MAX_TOKENS,
      effort: AI_EFFORT_LEVELS.low,
    }).catch((cause: unknown): never => {
      throw cause instanceof Error && cause.message === AI_ERROR_MESSAGES.answerMalformed
        ? badRequestError(ERROR_MESSAGES.bagLabelUnreadable, cause)
        : serviceUnavailableError(ERROR_MESSAGES.aiUnavailable, cause);
    });

    await aiUsageService.record({
      userId,
      functionName: AI_FUNCTION_NAMES.parseCoffeeBag,
      model: completion.model,
      tokensIn: completion.tokensIn,
      tokensOut: completion.tokensOut,
      costEstimate: estimateAiCost(completion.tokensIn, completion.tokensOut),
    });

    return { fields: completion.value, model: completion.model };
  };

  return {
    parse: async (userId, imageUrl): Promise<ParseCoffeeBagResponse> => {
      const image = await fetchImage(imageUrl);
      const byImage = await repository.findByImageHash(image.hash);

      if (byImage !== null) {
        return { fields: byImage.fields, fromCache: FROM_CACHE };
      }

      const reading = await readLabel(userId, image);
      const roasterKey = normalizeLabelKey(reading.fields.roaster.value);
      const nameKey = normalizeLabelKey(reading.fields.name.value);
      const known =
        roasterKey === null || nameKey === null
          ? null
          : await repository.findByLabel({ roasterKey, nameKey });

      /*
       * A coffee somebody has already scanned answers with the stored reading
       * rather than with this photograph's. Shop lighting against daylight is
       * the same coffee described twice, and the entry that has been standing
       * long enough for a person to have corrected it is the better of the two.
       *
       * This photograph is still written down, keyed by its own hash, so
       * re-sending it costs nothing. Its label keys are left null: the pair
       * already points at the stored entry, and only one row may hold it.
       */
      await repository.save({
        imageHash: image.hash,
        roasterKey: known === null ? roasterKey : null,
        nameKey: known === null ? nameKey : null,
        fields: known?.fields ?? reading.fields,
        model: known?.model ?? reading.model,
      });

      return {
        fields: known?.fields ?? reading.fields,
        fromCache: known === null ? FRESHLY_READ : FROM_CACHE,
      };
    },
  };
};
