import {
  sourceRecipeSchema,
  type ParseRecipeRequest,
  type ParseRecipeResponse,
} from '@brewmate/shared';

import { AI_ERROR_MESSAGES } from '../../../ai/aiErrorMessages.js';
import type { AiImage } from '../../../ai/aiImage.js';
import { AI_EFFORT_LEVELS, AI_PARSE_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { ImageFetcher } from '../../../ai/imageFetcher.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { badRequestError } from '../../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { toGrinder } from '../../grinders/grinderMapper.js';
import type { GrinderRepository } from '../../grinders/grinderRepository.js';
import { completeBilledJson } from '../completeBilledJson.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';
import { PROMPT_SECTION_SEPARATOR } from '../constants/promptFormatting.js';

import { parsedSourceRecipeSchema, type ParsedSourceRecipe } from './parsedSourceRecipeSchema.js';
import {
  SOURCE_RECIPE_IMAGE_INSTRUCTION,
  SOURCE_RECIPE_SYSTEM_PROMPT,
  SOURCE_RECIPE_TEXT_INSTRUCTION,
} from './sourceRecipePrompt.js';

const ONE_MATCH = 1;
const FIRST_PAGE = 0;
const NAME_SEPARATOR = ' ';

export interface RecipeParseDependencies {
  readonly completionClient: TextCompletionClient;
  readonly imageFetcher: ImageFetcher;
  readonly grinderRepository: GrinderRepository;
  readonly aiUsageService: AiUsageService;
}

export interface RecipeParseService {
  parse(userId: string, input: ParseRecipeRequest): Promise<ParseRecipeResponse>;
}

/**
 * Reads somebody else's recipe into fields, and stops there.
 *
 * This is the only place a model touches the import, apart from writing the
 * explanation at the end. The conversion itself is arithmetic and stays
 * arithmetic - what a model is good at here is reading "18 in, 36 out in 28
 * seconds, ground fine" off a video description, and what it is not good at is
 * being trusted about how far 22 clicks on one grinder is from 14 on another.
 *
 * The answer is handed straight back to the person who pasted the text in,
 * before anything is converted. That is the same offer the calibration brew
 * makes - "rozumiem tomu takto" - and it is only honest if the app really does
 * show what it understood, hole for hole.
 */
export const createRecipeParseService = ({
  completionClient,
  imageFetcher,
  grinderRepository,
  aiUsageService,
}: RecipeParseDependencies): RecipeParseService => {
  const fetchImage = async (imageUrl: string): Promise<AiImage> => {
    try {
      return await imageFetcher.fetch(imageUrl);
    } catch (cause: unknown) {
      throw badRequestError(ERROR_MESSAGES.recipePhotoUnreadable, cause);
    }
  };

  /**
   * The catalogue entry behind the grinder the recipe named.
   *
   * Searched rather than matched exactly, because a recipe writes "Comandante
   * C40" where the catalogue holds "Comandante C40 MK4", and the whole value
   * of finding it is that the conversion then has a curve to read. A miss is
   * an ordinary outcome: the grind falls back to the words the recipe used,
   * and the conversion says which of the two it did.
   */
  const findGrinder = async (
    userId: string,
    parsed: ParsedSourceRecipe,
  ): Promise<string | null> => {
    if (parsed.grinderBrand === null && parsed.grinderModel === null) {
      return null;
    }

    const rows = await grinderRepository.list({
      userId,
      limit: ONE_MATCH,
      offset: FIRST_PAGE,
      search: [parsed.grinderBrand, parsed.grinderModel]
        .filter((part: string | null): part is string => part !== null)
        .join(NAME_SEPARATOR),
    });
    const found = rows.map(toGrinder).at(FIRST_PAGE);

    return found?.id ?? null;
  };

  const readSource = async (
    userId: string,
    input: ParseRecipeRequest,
  ): Promise<ParsedSourceRecipe> => {
    const text = input.text ?? null;
    const imageUrl = input.imageUrl ?? null;
    const image = imageUrl === null ? undefined : await fetchImage(imageUrl);
    const sections = [
      image === undefined ? SOURCE_RECIPE_TEXT_INSTRUCTION : SOURCE_RECIPE_IMAGE_INSTRUCTION,
      ...(text === null ? [] : [text]),
    ];

    const completion = await completeBilledJson({
      aiUsageService,
      userId,
      client: completionClient,
      schema: parsedSourceRecipeSchema,
      functionName: AI_FUNCTION_NAMES.parseRecipe,
      system: SOURCE_RECIPE_SYSTEM_PROMPT,
      prompt: sections.join(PROMPT_SECTION_SEPARATOR),
      image,
      maxTokens: AI_PARSE_MAX_TOKENS,
      effort: AI_EFFORT_LEVELS.low,
    }).catch((cause: unknown): never => {
      throw cause instanceof Error && cause.message === AI_ERROR_MESSAGES.answerMalformed
        ? badRequestError(ERROR_MESSAGES.recipeSourceUnreadable, cause)
        : serviceUnavailableError(ERROR_MESSAGES.recipeImportUnavailable, cause);
    });

    return completion.value;
  };

  return {
    parse: async (userId, input): Promise<ParseRecipeResponse> => {
      const parsed = await readSource(userId, input);

      /*
       * Parsed back through the contract's own schema rather than spread by
       * hand. The two names the model answered with are not part of a source
       * recipe - the id they were looked up into is - and letting the schema
       * drop them means adding a field to the parse can never leak one into a
       * stored recipe by being forgotten here.
       */
      return {
        source: sourceRecipeSchema.parse({
          ...parsed,
          grinderId: await findGrinder(userId, parsed),
        }),
      };
    },
  };
};
