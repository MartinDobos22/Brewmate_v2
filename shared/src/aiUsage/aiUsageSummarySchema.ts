import { z } from 'zod';

import { AI_LIMIT_KINDS, AI_USAGE_WINDOWS } from './aiUsageLimits.js';
import { AI_FUNCTION_NAME_MAX_LENGTH, AI_TOKENS_MIN } from './aiUsageFieldLimits.js';

/**
 * What one window has been spent so far, and what it may still spend.
 *
 * `resetsAt` is here rather than left to the app to work out, because "skús to
 * neskôr" is not an answer somebody can act on and "o 40 minút" is. Both
 * windows roll over in UTC, which is stated once, here, so the app never has
 * to guess a timezone the server did not use.
 *
 * Costs travel as decimal strings, spent and ceiling alike, so the screen
 * formats one number the same way as the other.
 */
export const aiUsageWindowSchema = z.object({
  window: z.enum(AI_USAGE_WINDOWS),
  calls: z.number().int().min(AI_TOKENS_MIN),
  callLimit: z.number().int().positive(),
  tokensIn: z.number().int().min(AI_TOKENS_MIN),
  tokensOut: z.number().int().min(AI_TOKENS_MIN),
  costEstimate: z.string(),
  costLimit: z.string(),
  /** Which ceiling is already reached, or null while there is room in both. */
  exhaustedBy: z.enum(AI_LIMIT_KINDS).nullable(),
  resetsAt: z.iso.datetime(),
});

export type AiUsageWindow = z.infer<typeof aiUsageWindowSchema>;

/** One feature's share of the month, which is what makes a total actionable. */
export const aiUsageFunctionTotalSchema = z.object({
  functionName: z.string().max(AI_FUNCTION_NAME_MAX_LENGTH),
  calls: z.number().int().min(AI_TOKENS_MIN),
  tokensIn: z.number().int().min(AI_TOKENS_MIN),
  tokensOut: z.number().int().min(AI_TOKENS_MIN),
  costEstimate: z.string(),
});

export type AiUsageFunctionTotal = z.infer<typeof aiUsageFunctionTotalSchema>;

/**
 * The cost dashboard, computed from `ai_usage_logs` and nothing else.
 *
 * The same rows the limiter reads, so the number somebody is shown and the
 * number that refuses their next scan cannot disagree.
 */
export const aiUsageSummarySchema = z.object({
  day: aiUsageWindowSchema,
  month: aiUsageWindowSchema,
  byFunction: z.array(aiUsageFunctionTotalSchema),
  generatedAt: z.iso.datetime(),
});

export type AiUsageSummary = z.infer<typeof aiUsageSummarySchema>;

/**
 * What a refusal tells the app, in `details` of the error envelope.
 *
 * Enough to write a sentence somebody can act on - which ceiling, over which
 * window, and when it lifts - without the app having to parse a message
 * written for a log.
 */
export const aiRateLimitDetailsSchema = z.object({
  window: z.enum(AI_USAGE_WINDOWS),
  limit: z.enum(AI_LIMIT_KINDS),
  resetsAt: z.iso.datetime(),
});

export type AiRateLimitDetails = z.infer<typeof aiRateLimitDetailsSchema>;
