import type { AiImageMediaType } from './constants/aiImageLimits.js';

/**
 * A photograph on its way to a model, and the fingerprint of the bytes it was
 * made from.
 *
 * The hash is carried alongside the image rather than derived later, because
 * it is what makes the same photograph cost one model call instead of two -
 * and it can only be computed by whoever actually held the bytes.
 */
export interface AiImage {
  readonly mediaType: AiImageMediaType;
  readonly base64Data: string;
  /** Content hash of the raw bytes, hex encoded. */
  readonly hash: string;
}
