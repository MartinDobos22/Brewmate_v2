import { z } from 'zod';

import { brewLogSchema } from '../brewLogs/brewLogSchema.js';
import { recipeChatMessageSchema } from '../recipeChat/recipeChatMessageSchema.js';
import { CHAT_MESSAGE_MAX_LENGTH } from '../recipeChat/recipeChatFieldLimits.js';

import { espressoShotSchema } from './espressoShotSchema.js';

/**
 * Body of `POST /ai/espresso-dial-in`.
 *
 * One shot, and what the person thought of it. The recipe it was pulled from
 * carries everything else - the coffee, the basket, the grinder, the dose that
 * has not changed since the last shot - and the chain of recipes behind it
 * carries every change already tried, which is what stops an answer from
 * proposing to grind back to where the second shot already was.
 *
 * The shot and the sentence arrive together on purpose. Recording the numbers
 * through `POST /brew-logs` and then asking about them separately would be two
 * round trips at the exact moment somebody is standing over a cooling
 * espresso, and would leave a shot in the history that nothing ever answered.
 */
export const espressoDialInRequestSchema = z
  .object({
    recipeId: z.uuid(),
    shot: espressoShotSchema,
    /**
     * How it tasted, in their own words.
     *
     * Required, and written by the app rather than assembled here: the numbers
     * are already on the shot, and what this field adds is the half of a shot
     * a scale cannot read. The app fills the box with a Slovak sentence the
     * person can then edit, which is the same bargain the chat's quick chips
     * make - a shortcut to writing rather than a menu of answers.
     */
    message: z.string().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
  })
  .strict();

export type EspressoDialInRequest = z.infer<typeof espressoDialInRequestSchema>;

/**
 * The shot as it was recorded, and both halves of what was said about it.
 *
 * The brew log comes back because it is the timeline: the screen draws the run
 * of shots from these rows rather than from anything it kept in memory, so
 * closing the app halfway through a dial-in loses nothing.
 *
 * The proposal rides on `assistantMessage.recipePatch`, as every proposal in
 * this app does - stored next to the sentence that argued for it, applied only
 * if somebody taps. A dial-in where the app silently moved the grind would be
 * one nobody could reconstruct afterwards.
 */
export const espressoDialInResponseSchema = z.object({
  shot: brewLogSchema,
  userMessage: recipeChatMessageSchema,
  assistantMessage: recipeChatMessageSchema,
});

export type EspressoDialInResponse = z.infer<typeof espressoDialInResponseSchema>;
