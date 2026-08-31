import type { Env } from './envSchema.js';
import type { VisionConfig } from './visionConfig.js';

/**
 * @returns the optical reader's credentials, or null when either half is
 * absent.
 *
 * Both or neither, because a key with nowhere to send it and an endpoint with
 * nothing to authenticate against are each half a feature - the same reason
 * the model client and the image fetcher travel as one nullable pair.
 *
 * Null is a fully working state, and a quieter one than the model provider's
 * absence: reading a label is the model's job and always was. Without this the
 * photograph simply goes to the model unaccompanied and nobody checks it
 * first, which is exactly what this application did before.
 */
export const resolveVisionConfig = (env: Env): VisionConfig | null =>
  env.GOOGLE_VISION_API_KEY === undefined || env.GOOGLE_VISION_ENDPOINT === undefined
    ? null
    : { apiKey: env.GOOGLE_VISION_API_KEY, endpoint: env.GOOGLE_VISION_ENDPOINT };
