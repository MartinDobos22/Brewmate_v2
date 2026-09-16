import type { PhotoMediaType } from '@brewmate/shared';

/**
 * A photograph on its way to a model, and the fingerprint of the bytes it was
 * made from.
 *
 * The hash is carried alongside the image rather than derived later, because
 * it is what makes the same photograph cost one model call instead of two -
 * and it can only be computed by whoever actually held the bytes.
 *
 * The format is the contract's own list rather than a second copy of it here.
 * The app decides what it sends now, so a format this server would refuse has
 * to be a type error where the photograph is read off the phone.
 */
export interface AiImage {
  readonly mediaType: PhotoMediaType;
  readonly base64Data: string;
  /** Content hash of the raw bytes, hex encoded. */
  readonly hash: string;
}
