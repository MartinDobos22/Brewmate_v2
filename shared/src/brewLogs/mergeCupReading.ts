import type { CupReading } from './cupReadingSchema.js';

/**
 * What is now known about a cup, after one more thing was said about it.
 *
 * Field by field, the latest word wins and silence changes nothing: somebody
 * who said "bola kyslá" and two messages later "a trochu slabá" has described
 * one cup that was both, not two cups that were one each.
 */
export const mergeCupReading = (previous: CupReading | null, heard: CupReading): CupReading => ({
  extraction: heard.extraction ?? previous?.extraction ?? null,
  strength: heard.strength ?? previous?.strength ?? null,
});
