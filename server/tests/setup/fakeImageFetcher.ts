import { createHash } from 'node:crypto';

import type { AiImage } from '../../src/ai/aiImage.js';
import { AI_IMAGE_MEDIA_TYPES } from '../../src/ai/constants/aiImageLimits.js';
import type { ImageFetcher } from '../../src/ai/imageFetcher.js';

const HASH_ALGORITHM = 'sha256';
const HASH_ENCODING = 'hex';
const ENCODING = 'base64';

/**
 * Stands in for the storage bucket.
 *
 * The hash is taken from the URL rather than from real bytes, which is exactly
 * the property the cache tests need: the same URL is the same photograph, a
 * different URL is a different one, and no test has to carry a JPEG around to
 * prove it.
 */
export const createFakeImageFetcher = (): ImageFetcher => ({
  fetch: (imageUrl: string): Promise<AiImage> =>
    Promise.resolve({
      mediaType: AI_IMAGE_MEDIA_TYPES.jpeg,
      base64Data: Buffer.from(imageUrl).toString(ENCODING),
      hash: createHash(HASH_ALGORITHM).update(imageUrl).digest(HASH_ENCODING),
    }),
});
