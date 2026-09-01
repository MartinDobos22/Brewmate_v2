import { z } from 'zod';

import { partialTasteAxesSchema } from '../tasteProfiles/tasteAxesSchema.js';
import { CONFIDENCE_MAX, CONFIDENCE_MIN } from '../tasteProfiles/tasteProfileFieldLimits.js';

import {
  COFFEE_SUMMARY_MAX_LENGTH,
  READING_FLAVOUR_NOTE_MAX_LENGTH,
  READING_FLAVOUR_NOTES_MAX,
} from './constants/readingLimits.js';

/**
 * What a model read off a label that the tables could not.
 *
 * Note the shape carefully: this is evidence, not an answer. There is no field
 * anywhere in it for a finished estimate, a confidence in one, or anything the
 * app would print as fact - the model states where it thinks a coffee like
 * this sits and how sure it is, and the fold weighs that against everything
 * the label already said. A rule in a prompt is a request; a field that does
 * not exist is a guarantee.
 *
 * That guarantee is the point. Asked outright what a coffee tastes like, a
 * model will confidently describe a bag it has never met, and nobody -
 * including the model - can say which part came from the label and which from
 * the roaster's marketing copy in its training data. Asked instead to read
 * this label into observations, it does the thing it is genuinely better at
 * than a lookup table: understanding "pačuli a mokrý asfalt", knowing what
 * Yirgacheffe or Nyeri implies, and recognising a note written in a language
 * no lexicon here covers.
 */
export const coffeeTasteReadingSchema = z.object({
  /**
   * Where a coffee like this one sits, on the axes it can say something about.
   * An axis it has no view on is left out rather than filled with a middle.
   */
  axes: partialTasteAxesSchema,
  /**
   * How much the label actually supported this reading, 0..1.
   *
   * The model's own estimate of how much it was given to work with, which is
   * a question it can answer honestly because it is about the label rather
   * than about the coffee. It scales the weight this reading carries into the
   * fold, so a bag printing only a name contributes a weak signal even when
   * the model has a strong opinion about the roaster.
   */
  confidence: z.number().min(CONFIDENCE_MIN).max(CONFIDENCE_MAX),
  /**
   * The flavours this coffee will actually show, in the drinker's own
   * language. Not the printed notes copied back: the notes are marketing as
   * well as description, and what the app needs is what somebody will taste.
   */
  flavourNotes: z
    .array(z.string().max(READING_FLAVOUR_NOTE_MAX_LENGTH))
    .max(READING_FLAVOUR_NOTES_MAX),
  /**
   * Two Slovak sentences describing the cup.
   *
   * The one part of this a model is asked to write rather than read, and the
   * one part code cannot produce: five numbers are a shape, and "chutí ako
   * horúca čokoláda s orechmi" is what somebody standing in a shop actually
   * wanted to know.
   */
  summary: z.string().max(COFFEE_SUMMARY_MAX_LENGTH),
});

export type CoffeeTasteReading = z.infer<typeof coffeeTasteReadingSchema>;
