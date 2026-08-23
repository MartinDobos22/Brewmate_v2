import { z } from 'zod';

import { PARSED_CONFIDENCE_MAX, PARSED_CONFIDENCE_MIN } from './aiFieldLimits.js';

/**
 * One field read off a label, and how sure the reader was of it.
 *
 * `value` is nullable everywhere: a thumb over the roast date, a bag
 * photographed from the front while the origin is printed on the back, glare
 * across the weight - all of them are the normal case rather than a failure,
 * and `null` says so without the app having to invent a plausible answer.
 */
export interface ParsedField<TValue> {
  readonly value: TValue | null;
  readonly confidence: number;
}

const confidenceSchema = (): z.ZodNumber =>
  z.number().min(PARSED_CONFIDENCE_MIN).max(PARSED_CONFIDENCE_MAX);

/**
 * Wraps a field's own schema in the value/confidence pair.
 *
 * The value is still validated against the same bounds a stored bag obeys, so
 * a model that reports an altitude of forty thousand metres fails validation
 * here rather than reaching the cupboard.
 */
export const parsedFieldSchema = <TValue extends z.ZodType>(
  value: TValue,
): z.ZodObject<{ value: z.ZodNullable<TValue>; confidence: z.ZodNumber }> =>
  z.object({ value: value.nullable(), confidence: confidenceSchema() });
