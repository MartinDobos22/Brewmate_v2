import { z } from 'zod';

import { tasteProfileEventSchema } from '../tasteProfiles/tasteProfileEventSchema.js';
import { tasteProfileSchema } from '../tasteProfiles/tasteProfileSchema.js';

import { attributeInsightSchema } from './attributeInsightSchema.js';
import { SUGGESTION_REF_MAX_LENGTH } from './insightFieldLimits.js';
import { tasteSuggestionSchema } from './tasteSuggestionSchema.js';

/**
 * What this account's history adds up to.
 *
 * `brewCount` is the whole report's denominator and is printed beside it,
 * because "najčastejšie Etiópia" means one thing after forty cups and nothing
 * at all after three. Below the threshold the attribute list comes back empty
 * rather than ranking a coincidence, and the app says what would change that.
 */
export const insightsResponseSchema = z.object({
  brewCount: z.number().int().nonnegative(),
  attributes: z.array(attributeInsightSchema),
  /** Null when there is nothing worth proposing, or the last proposal was refused. */
  suggestion: tasteSuggestionSchema.nullable(),
  generatedAt: z.iso.datetime(),
});

export type InsightsResponse = z.infer<typeof insightsResponseSchema>;

/** Accepting or refusing names the evidence, never the conclusion drawn from it. */
export const tasteSuggestionRefSchema = z.object({
  ref: z.string().min(1).max(SUGGESTION_REF_MAX_LENGTH),
});

export type TasteSuggestionRef = z.infer<typeof tasteSuggestionRefSchema>;

/**
 * What accepting produced: the event that was appended, and the profile the
 * fold arrived at afterwards.
 *
 * Both, because the event is the audit trail and the profile is the answer -
 * and a screen that showed one without the other would either report a change
 * nobody can trace or a trace nobody can see the effect of.
 */
export const acceptTasteSuggestionResponseSchema = z.object({
  event: tasteProfileEventSchema,
  profile: tasteProfileSchema,
});

export type AcceptTasteSuggestionResponse = z.infer<typeof acceptTasteSuggestionResponseSchema>;

export const dismissTasteSuggestionResponseSchema = z.object({
  ref: z.string().max(SUGGESTION_REF_MAX_LENGTH),
  dismissedAt: z.iso.datetime(),
});

export type DismissTasteSuggestionResponse = z.infer<typeof dismissTasteSuggestionResponseSchema>;
