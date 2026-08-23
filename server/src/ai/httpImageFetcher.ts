import { createHash } from 'node:crypto';

import { HTTP_METHODS } from '../constants/httpMethods.js';

import { AI_ERROR_MESSAGES } from './aiErrorMessages.js';
import type { AiImage } from './aiImage.js';
import {
  AI_IMAGE_ENCODING,
  AI_IMAGE_FETCH_TIMEOUT_MS,
  AI_IMAGE_MAX_BYTES,
  AI_IMAGE_MEDIA_TYPE_VALUES,
  type AiImageMediaType,
} from './constants/aiImageLimits.js';
import type { ImageFetcher } from './imageFetcher.js';

const CONTENT_TYPE_HEADER = 'content-type';
const CONTENT_TYPE_SEPARATOR = ';';
const HASH_ALGORITHM = 'sha256';
const HASH_ENCODING = 'hex';
const EMPTY = '';

/** `image/jpeg; charset=utf-8` is still `image/jpeg`. */
const readMediaType = (header: string | null): AiImageMediaType => {
  const [declared = EMPTY] = (header ?? EMPTY).split(CONTENT_TYPE_SEPARATOR);
  const normalized = declared.trim().toLowerCase();
  const supported = AI_IMAGE_MEDIA_TYPE_VALUES.find(
    (mediaType: AiImageMediaType): boolean => mediaType === normalized,
  );

  if (supported === undefined) {
    throw new Error(AI_ERROR_MESSAGES.imageTypeUnsupported);
  }

  return supported;
};

/**
 * Downloads the photograph the app uploaded.
 *
 * The bytes are fetched here rather than handed to the provider as a URL for
 * two reasons: the hash that makes a repeated scan free can only be taken from
 * the bytes themselves, and a storage URL that happens to need the app's own
 * credentials is then this server's problem rather than a silent failure
 * somewhere else.
 *
 * The URL comes from a client, so the size, the format and the time it may
 * take are all limits rather than expectations.
 */
export const createHttpImageFetcher = (): ImageFetcher => ({
  fetch: async (imageUrl: string): Promise<AiImage> => {
    const response = await fetch(imageUrl, {
      method: HTTP_METHODS.get,
      signal: AbortSignal.timeout(AI_IMAGE_FETCH_TIMEOUT_MS),
    }).catch((cause: unknown): never => {
      throw new Error(AI_ERROR_MESSAGES.imageUnreachable, { cause });
    });

    if (!response.ok) {
      throw new Error(AI_ERROR_MESSAGES.imageUnreachable);
    }

    const mediaType = readMediaType(response.headers.get(CONTENT_TYPE_HEADER));
    const bytes = Buffer.from(await response.arrayBuffer());

    if (bytes.byteLength > AI_IMAGE_MAX_BYTES) {
      throw new Error(AI_ERROR_MESSAGES.imageTooLarge);
    }

    return {
      mediaType,
      base64Data: bytes.toString(AI_IMAGE_ENCODING),
      hash: createHash(HASH_ALGORITHM).update(bytes).digest(HASH_ENCODING),
    };
  },
});
