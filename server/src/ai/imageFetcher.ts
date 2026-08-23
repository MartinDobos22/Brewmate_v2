import type { AiImage } from './aiImage.js';

/**
 * Fetches the photograph the app uploaded and hands back its bytes.
 *
 * An interface for the same reason `TokenVerifier` is one: the tests cannot
 * reach a storage bucket, and the HTTP layer has to be exercisable without a
 * live one. The implementation is also the only place that decides how large
 * an image may be and which formats are allowed - a URL comes from a client,
 * so those are limits rather than expectations.
 */
export interface ImageFetcher {
  fetch(imageUrl: string): Promise<AiImage>;
}
