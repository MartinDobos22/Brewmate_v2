import type { AiConfig } from './aiConfig.js';
import type { Env } from './envSchema.js';

/**
 * @returns the credentials, or null when they are absent.
 *
 * Null is a working state rather than a failure: the tests run without a
 * provider, and a deployment without a key still serves every screen that does
 * not ask a model anything. The two AI routes answer "service unavailable"
 * instead of the process refusing to start.
 */
export const resolveAiConfig = (env: Env): AiConfig | null =>
  env.ANTHROPIC_API_KEY === undefined ? null : { anthropicApiKey: env.ANTHROPIC_API_KEY };
