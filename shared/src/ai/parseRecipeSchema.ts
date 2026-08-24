import { z } from 'zod';

import { IMAGE_URL_MAX_LENGTH } from '../coffeeBags/coffeeBagFieldLimits.js';
import { SOURCE_RECIPE_TEXT_MAX_LENGTH } from '../conversion/conversionFieldLimits.js';
import { sourceRecipeSchema } from '../conversion/sourceRecipeSchema.js';

/**
 * Body of `POST /ai/parse-recipe`.
 *
 * A recipe somebody found, in whichever form they have it: pasted out of a
 * video description, or photographed off a screen. At least one of the two has
 * to be there - a request with neither is asking to be told what is in an
 * empty room.
 *
 * The photograph travels as a URL for the same reason a coffee bag's does: the
 * app uploads it to storage and sends the link, so a retry costs one short
 * request rather than a second upload.
 */
export const parseRecipeRequestSchema = z
  .object({
    text: z.string().min(1).max(SOURCE_RECIPE_TEXT_MAX_LENGTH).nullable().optional(),
    imageUrl: z.url().max(IMAGE_URL_MAX_LENGTH).nullable().optional(),
  })
  .strict()
  .refine(
    (body: { text?: string | null; imageUrl?: string | null }): boolean =>
      (body.text ?? null) !== null || (body.imageUrl ?? null) !== null,
  );

export type ParseRecipeRequest = z.infer<typeof parseRecipeRequestSchema>;

/**
 * What could be read out of it, and nothing else.
 *
 * Every field the source did not state comes back null rather than filled in
 * with something plausible, which is the same rule a photographed coffee label
 * is read under and it exists for the same reason: an invented dose becomes a
 * ratio, which becomes a recipe, which becomes a bad cup nobody can trace back
 * to a guess made about a video.
 *
 * The answer is shown to the person before anything is converted. What was
 * misread gets corrected in the form, which is only an honest offer if the app
 * really does show what it understood.
 */
export const parseRecipeResponseSchema = z.object({ source: sourceRecipeSchema });

export type ParseRecipeResponse = z.infer<typeof parseRecipeResponseSchema>;
