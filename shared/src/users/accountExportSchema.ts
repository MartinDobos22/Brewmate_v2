import { z } from 'zod';

import { storedAnalyticsEventSchema } from '../analytics/analyticsEventSchema.js';
import { aiUsageLogSchema } from '../aiUsage/aiUsageLogSchema.js';
import { bagEvaluationSchema } from '../bagEvaluations/bagEvaluationSchema.js';
import { brewLogSchema } from '../brewLogs/brewLogSchema.js';
import { coffeeBagSchema } from '../coffeeBags/coffeeBagSchema.js';
import { equipmentSchema } from '../equipment/equipmentSchema.js';
import { equipmentSetSchema } from '../equipmentSets/equipmentSetSchema.js';
import { storedTasteSuggestionSchema } from '../insights/tasteSuggestionSchema.js';
import { recipeChatMessageSchema } from '../recipeChat/recipeChatMessageSchema.js';
import { recipeSchema } from '../recipes/recipeSchema.js';
import { tasteProfileEventSchema } from '../tasteProfiles/tasteProfileEventSchema.js';
import { tasteProfileSchema } from '../tasteProfiles/tasteProfileSchema.js';

import { userSchema } from './userSchema.js';

/**
 * Bumped whenever a table joins or leaves the export.
 *
 * Written into the document itself, because the file outlives this code: a
 * year-old export that somebody opens has to be able to say what it was a
 * complete copy *of*, and a missing section is otherwise indistinguishable
 * from a section that was empty.
 */
export const ACCOUNT_EXPORT_FORMAT_VERSION = 1;

/**
 * Everything this account has stored, in one document.
 *
 * Article 20 asks for the data in a structured, commonly used, machine-readable
 * form, so this is the same JSON the API already speaks - each section is the
 * contract's own schema, unmodified. Somebody who exports and then deletes has
 * a file that could be read back in.
 *
 * It is deliberately every user-owned table, including the ones nobody thinks
 * of as theirs: the model usage recorded against them and the analytics events
 * their phone sent. Both are rows with their `user_id` on them, so both are
 * personal data, so both are here - an export that quietly left out the
 * telemetry would be answering a different question from the one that was
 * asked.
 *
 * Two things are absent, and for the same reason: the grinder catalogue entry
 * somebody contributed and the label cache their photograph filled belong to
 * nobody. They survive an account deletion by design, and what they hold is a
 * product on a shelf rather than a fact about a person.
 */
export const accountExportSchema = z.object({
  formatVersion: z.number().int().positive(),
  exportedAt: z.iso.datetime(),
  account: userSchema,
  /** Null only for an account whose profile has never been folded. */
  tasteProfile: tasteProfileSchema.nullable(),
  tasteProfileEvents: z.array(tasteProfileEventSchema),
  equipment: z.array(equipmentSchema),
  equipmentSets: z.array(equipmentSetSchema),
  coffeeBags: z.array(coffeeBagSchema),
  bagEvaluations: z.array(bagEvaluationSchema),
  recipes: z.array(recipeSchema),
  recipeMessages: z.array(recipeChatMessageSchema),
  brewLogs: z.array(brewLogSchema),
  tasteSuggestions: z.array(storedTasteSuggestionSchema),
  aiUsage: z.array(aiUsageLogSchema),
  analyticsEvents: z.array(storedAnalyticsEventSchema),
});

export type AccountExport = z.infer<typeof accountExportSchema>;
