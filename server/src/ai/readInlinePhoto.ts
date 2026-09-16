import { createHash } from 'node:crypto';

import type { Photo } from '@brewmate/shared';

import { AI_ERROR_MESSAGES } from './aiErrorMessages.js';
import type { AiImage } from './aiImage.js';
import { AI_IMAGE_ENCODING, AI_IMAGE_MAX_BYTES } from './constants/aiImageLimits.js';

const HASH_ALGORITHM = 'sha256';
const HASH_ENCODING = 'hex';

/**
 * Turns the photograph in a request body into the bytes a model is shown.
 *
 * This used to be a port with an HTTP implementation behind it - the app put
 * the picture in a bucket, sent a link, and the server went and fetched it.
 * An interface was the right shape for that, because a test cannot reach a
 * storage bucket. There is nothing to reach any more: the bytes arrive with
 * the request, so decoding them is arithmetic, and a port around arithmetic is
 * a seam that can only ever be implemented once.
 *
 * The media type is the client's claim and stays that way. The contract limits
 * it to the four formats a model will look at, and the provider is the one
 * that finally disagrees if the bytes are not what the header says - guessing
 * at the format here by sniffing the first few bytes would be this server
 * quietly overruling the phone that took the photograph.
 *
 * The size is checked after decoding rather than before. Base-64 is what the
 * field holds but bytes are what anybody pays for, and the ceiling is written
 * in bytes.
 *
 * @throws Error when the decoded picture is larger than the ceiling. The
 * contract's own length limit catches this on the way in for anything sent by
 * this application; the throw is for whatever else finds the endpoint.
 */
export const readInlinePhoto = (photo: Photo): AiImage => {
  const bytes = Buffer.from(photo.data, AI_IMAGE_ENCODING);

  if (bytes.byteLength > AI_IMAGE_MAX_BYTES) {
    throw new Error(AI_ERROR_MESSAGES.imageTooLarge);
  }

  return {
    mediaType: photo.mediaType,
    base64Data: photo.data,
    hash: createHash(HASH_ALGORITHM).update(bytes).digest(HASH_ENCODING),
  };
};
