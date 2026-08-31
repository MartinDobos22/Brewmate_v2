import {
  EMPTY_PARSED_BAG_FIELDS,
  parsedBagFieldsSchema,
  type LabelPhotoIssue,
  type ParseCoffeeBagResponse,
  type ParsedBagFields,
} from '@brewmate/shared';

import { AI_ERROR_MESSAGES } from '../../../ai/aiErrorMessages.js';
import type { AiImage } from '../../../ai/aiImage.js';
import { AI_EFFORT_LEVELS, AI_PARSE_MAX_TOKENS } from '../../../ai/constants/aiModels.js';
import type { ImageFetcher } from '../../../ai/imageFetcher.js';
import type { LabelPhotoReading, LabelTextReader } from '../../../ai/labelTextReader.js';
import type { TextCompletionClient } from '../../../ai/textCompletionClient.js';
import { badRequestError } from '../../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../../errors/errorMessages.js';
import { serviceUnavailableError } from '../../../errors/serviceUnavailableError.js';
import type { AiUsageService } from '../../aiUsage/aiUsageService.js';
import { completeJson } from '../completeJson.js';
import { recordJsonUsage } from '../recordJsonUsage.js';
import { AI_FUNCTION_NAMES } from '../constants/aiFunctionNames.js';

import { BAG_LABEL_PROMPT, BAG_LABEL_SYSTEM_PROMPT, describeLabelText } from './bagLabelPrompt.js';
import type { CoffeeBagParseRepository } from './coffeeBagParseRepository.js';
import { normalizeLabelKey } from './normalizeLabelKey.js';

const FROM_CACHE = true;
const FRESHLY_READ = false;
const NOTHING = 0;

/**
 * Nobody looked at this photograph, which is not the same as having no
 * complaint.
 *
 * Both are written as the mutable arrays the contract infers rather than as
 * the readonly ones the reader hands back: the response is a value on its way
 * out of the process, and copying the reader's list into it is what keeps the
 * reader's own answer immutable where it is used.
 */
const UNCHECKED: LabelPhotoIssue[] | null = null;
const NO_COMPLAINT: LabelPhotoIssue[] = [];

/** What one reading produced, and which model produced it. */
interface LabelReading {
  readonly fields: ParsedBagFields;
  readonly model: string;
}

export interface CoffeeBagParseDependencies {
  readonly repository: CoffeeBagParseRepository;
  readonly imageFetcher: ImageFetcher;
  /** Null wherever none is configured; the photograph then goes unaccompanied. */
  readonly labelTextReader: LabelTextReader | null;
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
  labelTextReader,
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

  /**
   * What the optical reader made of the photograph, or null when there was
   * nobody to ask.
   *
   * A reader that cannot be reached is the same outcome as no reader at all,
   * and it is deliberately not an error. This call is an aid to reading a
   * label, not the reading itself: letting a third party's bad afternoon
   * refuse somebody's scan would make the feature less reliable than it was
   * before the aid existed.
   */
  const inspectPhoto = async (image: AiImage): Promise<LabelPhotoReading | null> => {
    if (labelTextReader === null) {
      return null;
    }

    return await labelTextReader.read(image).catch((): null => null);
  };

  const readLabel = async (
    userId: string,
    image: AiImage,
    printed: string | null,
  ): Promise<LabelReading> => {
    const completion = await completeJson({
      client: completionClient,
      schema: parsedBagFieldsSchema,
      functionName: AI_FUNCTION_NAMES.parseCoffeeBag,
      system: BAG_LABEL_SYSTEM_PROMPT,
      prompt: printed === null ? BAG_LABEL_PROMPT : describeLabelText(printed),
      image,
      maxTokens: AI_PARSE_MAX_TOKENS,
      effort: AI_EFFORT_LEVELS.low,
    }).catch((cause: unknown): never => {
      throw cause instanceof Error && cause.message === AI_ERROR_MESSAGES.answerMalformed
        ? badRequestError(ERROR_MESSAGES.bagLabelUnreadable, cause)
        : serviceUnavailableError(ERROR_MESSAGES.aiUnavailable, cause);
    });

    await recordJsonUsage(aiUsageService, { userId, completion });

    return { fields: completion.value, model: completion.model };
  };

  return {
    parse: async (userId, imageUrl): Promise<ParseCoffeeBagResponse> => {
      const image = await fetchImage(imageUrl);
      const byImage = await repository.findByImageHash(image.hash);

      /*
       * The stored reading answers before anybody is asked anything - the
       * optical reader included. These same bytes were read once and read
       * well enough to be worth keeping, so inspecting them again would spend
       * a call to be told what the row already says.
       */
      if (byImage !== null) {
        return { fields: byImage.fields, fromCache: FROM_CACHE, photoIssues: UNCHECKED };
      }

      const inspected = await inspectPhoto(image);

      /*
       * A photograph nothing could be read off never reaches the model.
       *
       * This is the one place in the scan where saying no is the useful
       * answer: the alternative is a model call that produces twelve nulls,
       * a form with nothing in it, and no explanation of why - which somebody
       * standing in a shop reads as the app being broken rather than as the
       * light being bad. The fields come back empty because nothing was read,
       * and the reasons come back with them so the app can say what to do
       * differently. Nothing is written to the cache: these bytes were never
       * read, and storing them under their own hash would make every retry of
       * the same bad photograph answer instantly with nothing.
       */
      if (inspected !== null && inspected.issues.length > NOTHING) {
        return {
          fields: EMPTY_PARSED_BAG_FIELDS,
          fromCache: FRESHLY_READ,
          photoIssues: [...inspected.issues],
        };
      }

      const reading = await readLabel(userId, image, inspected?.text ?? null);
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
        photoIssues: inspected === null ? UNCHECKED : NO_COMPLAINT,
      };
    },
  };
};
