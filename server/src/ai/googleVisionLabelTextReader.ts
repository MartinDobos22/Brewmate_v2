import type { VisionConfig } from '../config/visionConfig.js';
import { HTTP_METHODS } from '../constants/httpMethods.js';

import type { AiImage } from './aiImage.js';
import { AI_ERROR_MESSAGES } from './aiErrorMessages.js';
import { assessLabelPhoto } from './assessLabelPhoto.js';
import {
  LABEL_TEXT_MAX_CHARACTERS,
  LABEL_VISION_TIMEOUT_MS,
  VISION_ANNOTATE_PATH,
  VISION_FEATURES,
  VISION_KEY_PARAM,
} from './constants/labelPhotoLimits.js';
import type { LabelPhotoReading, LabelTextReader } from './labelTextReader.js';
import { readVisionAnnotation } from './readVisionAnnotation.js';
import { visionAnnotateResponseSchema } from './visionAnnotateSchema.js';

const CONTENT_TYPE_HEADER = 'content-type';
const JSON_CONTENT_TYPE = 'application/json';
const FIRST_RESPONSE = 0;
const TRANSCRIPT_START = 0;

/**
 * Google's Vision API, asked the two questions this application has for it.
 *
 * Document text detection rather than plain text detection, because a coffee
 * bag is a dense little document - a roaster across the top, a name under it,
 * a paragraph of notes and a date stamped on a seam - and the document reader
 * is the one that reports how sure it was of each word. That rating is the
 * whole basis for calling a photograph unsharp; without it there is nothing to
 * refuse a blurred picture on.
 *
 * The image properties come along in the same request rather than a second
 * one. They cost a fraction of what a round trip to a shop's signal does, and
 * they are only ever read when the first question has already gone badly.
 */
export const createGoogleVisionLabelTextReader = (config: VisionConfig): LabelTextReader => {
  const endpoint = new URL(VISION_ANNOTATE_PATH, config.endpoint);

  endpoint.searchParams.set(VISION_KEY_PARAM, config.apiKey);

  return {
    read: async (image: AiImage): Promise<LabelPhotoReading> => {
      const response = await fetch(endpoint, {
        method: HTTP_METHODS.post,
        headers: { [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE },
        signal: AbortSignal.timeout(LABEL_VISION_TIMEOUT_MS),
        body: JSON.stringify({
          requests: [
            {
              image: { content: image.base64Data },
              features: [
                { type: VISION_FEATURES.documentText },
                { type: VISION_FEATURES.imageProperties },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(AI_ERROR_MESSAGES.labelReaderRefused);
      }

      const parsed = visionAnnotateResponseSchema.safeParse(await response.json());

      if (!parsed.success) {
        throw new Error(AI_ERROR_MESSAGES.labelReaderMalformed, { cause: parsed.error });
      }

      const annotation = parsed.data.responses[FIRST_RESPONSE];

      /*
       * A per-image error rather than a failed request: the call went through
       * and the answer is that this one image could not be annotated. It is
       * the same outcome as the reader being unreachable - nobody looked - and
       * it is raised as such rather than silently becoming an empty transcript,
       * which would read as "there is nothing printed on this bag".
       */
      if (annotation === undefined || annotation.error !== undefined) {
        throw new Error(AI_ERROR_MESSAGES.labelReaderRefused);
      }

      const evidence = readVisionAnnotation(annotation);

      return {
        text: evidence.text.slice(TRANSCRIPT_START, LABEL_TEXT_MAX_CHARACTERS),
        issues: assessLabelPhoto(evidence),
      };
    },
  };
};
