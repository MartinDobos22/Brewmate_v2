import { z } from 'zod';

import { ROAST_LEVELS } from '../enums/roastLevels.js';
import { flavorAffinitiesSchema } from '../tasteProfiles/flavorAffinitiesSchema.js';
import { CONFIDENCE_MAX, CONFIDENCE_MIN } from '../tasteProfiles/tasteProfileFieldLimits.js';

import { INSIGHT_EXPLANATION_SOURCES, INSIGHT_REASON_KINDS } from './insightAttributes.js';
import {
  INSIGHT_EXPLANATION_MAX_LENGTH,
  INSIGHT_REASONS_MAX,
  INSIGHT_VALUE_MAX_LENGTH,
  SUGGESTION_REF_MAX_LENGTH,
} from './insightFieldLimits.js';

/**
 * One count that argues for the suggestion.
 *
 * Both sides of the argument are here - what was brewed and how much of the
 * history that is - because "svetlé praženie" on its own is not a reason. It
 * is the same rule the shop verdict is held to: a reason names the person and
 * the coffee, never only the coffee.
 */
export const suggestionReasonSchema = z.object({
  kind: z.enum(INSIGHT_REASON_KINDS),
  value: z.string().max(INSIGHT_VALUE_MAX_LENGTH),
  brewCount: z.number().int().nonnegative(),
  /** That value's share of the brews the report looked at. */
  share: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
});

export type SuggestionReason = z.infer<typeof suggestionReasonSchema>;

/**
 * What the history thinks the profile should say, offered rather than applied.
 *
 * Nothing here is written anywhere until somebody taps. That is the whole
 * point: this is a conclusion drawn from what a person reached for, not
 * something they told us, and an app that quietly rewrote a profile from
 * behaviour would be an app arguing with somebody about their own taste
 * without saying so.
 *
 * `ref` fingerprints the evidence, which does two things. Accepting the same
 * advice twice counts once, because the taste event carries the ref as its
 * `sourceRef`. And a dismissal is remembered against that ref alone, so the
 * suggestion stays gone until the evidence itself changes - new evidence is a
 * new question, and somebody who said no to six brews is entitled to be asked
 * again after twenty.
 */
export const tasteSuggestionSchema = z.object({
  ref: z.string().max(SUGGESTION_REF_MAX_LENGTH),
  /** Null where the history says nothing about roast that the profile does not. */
  roastPreference: z.enum(ROAST_LEVELS).nullable(),
  flavorAffinities: flavorAffinitiesSchema,
  /** What this evidence is worth, before the source's own trust is weighed in. */
  weight: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  reasons: z.array(suggestionReasonSchema).max(INSIGHT_REASONS_MAX),
  /**
   * The paragraph a model wrote about the counts above, or empty.
   *
   * Empty is a normal answer, not a failure: it means no model wrote one -
   * there is no provider configured, the account is out of allowance, or the
   * call did not come back - and `explanationSource` says so. The app then
   * builds the sentence from `reasons` itself, exactly as it does with the
   * conversion report, which is why every reason is a machine name with its
   * own counts rather than a phrase. The numbers are the same either way; only
   * who put them into Slovak differs, and the card says which.
   */
  explanation: z.string().max(INSIGHT_EXPLANATION_MAX_LENGTH),
  explanationSource: z.enum(INSIGHT_EXPLANATION_SOURCES),
});

export type TasteSuggestion = z.infer<typeof tasteSuggestionSchema>;

/**
 * One suggestion as it was stored, which is what a GDPR export carries.
 *
 * The conclusion the app drew about somebody and what they did about it are
 * both facts about that person, so both leave with them.
 */
export const storedTasteSuggestionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  ref: z.string().max(SUGGESTION_REF_MAX_LENGTH),
  explanation: z.string().max(INSIGHT_EXPLANATION_MAX_LENGTH).nullable(),
  dismissedAt: z.iso.datetime().nullable(),
  acceptedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

export type StoredTasteSuggestion = z.infer<typeof storedTasteSuggestionSchema>;
