import {
  GRINDER_BRAND_MAX_LENGTH,
  GRINDER_MODEL_MAX_LENGTH,
  sourceRecipeSchema,
} from '@brewmate/shared';
import { z } from 'zod';

/**
 * A recipe as a model is allowed to report having read it.
 *
 * The same shape the rest of the app uses, with one substitution: a model
 * cannot know a catalogue id, so it names the grinder in words and the server
 * looks the pair up. Handing it a uuid field would invite it to invent one,
 * and an invented id resolves to somebody else's grinder or to nothing at all.
 */
export const parsedSourceRecipeSchema = sourceRecipeSchema.omit({ grinderId: true }).extend({
  /** The grinder the recipe named, as it was written down. Null if none was. */
  grinderBrand: z.string().max(GRINDER_BRAND_MAX_LENGTH).nullable(),
  grinderModel: z.string().max(GRINDER_MODEL_MAX_LENGTH).nullable(),
});

export type ParsedSourceRecipe = z.infer<typeof parsedSourceRecipeSchema>;
