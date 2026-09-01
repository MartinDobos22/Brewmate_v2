import { z } from 'zod';

import { CONFIDENCE_MAX, CONFIDENCE_MIN } from './tasteProfileFieldLimits.js';

/**
 * How much evidence stands behind each axis, separately.
 *
 * One number for the whole profile cannot say the thing that matters here.
 * Somebody who has told us ten times that they cannot stand a sour cup and has
 * never once mentioned body is well understood on one axis and not understood
 * at all on another, and a single figure averages those into a half-truth that
 * is wrong about both.
 *
 * This is what lets the chart draw a vertex it has earned differently from one
 * it is only guessing at - which is the whole difference between a picture of
 * somebody's taste and a picture of the middle of the scale.
 */
export const tasteAxisConfidenceSchema = z.object({
  acidity: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  sweetness: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  body: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  bitterness: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  intensity: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
});

export type TasteAxisConfidence = z.infer<typeof tasteAxisConfidenceSchema>;

/**
 * The same thing said about only some of the axes.
 *
 * What one observation carries: an event usually speaks about two or three
 * axes, and has nothing at all to say about how sure it is of the rest.
 */
export const partialTasteAxesConfidenceSchema = tasteAxisConfidenceSchema.partial();

export type PartialTasteAxisConfidence = z.infer<typeof partialTasteAxesConfidenceSchema>;

/**
 * Below this an axis is not drawn as an opinion.
 *
 * It is deliberately low. The bar is not "well understood" - it is "somebody
 * said something about this at all", because the alternative to a faint vertex
 * is a vertex sitting at neutral, and a neat pentagon is the one shape that
 * claims knowledge nobody has.
 */
export const AXIS_KNOWN_THRESHOLD = 0.1;

/** True once anything at all has been heard about an axis. */
export const isAxisKnown = (confidence: number): boolean => confidence >= AXIS_KNOWN_THRESHOLD;
