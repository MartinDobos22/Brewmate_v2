import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * What was done to the cherries, read off whatever the bag calls it.
 *
 * Matched on a stem against the normalised label text rather than against a
 * closed set, because `process` is free text in the contract - the vocabulary
 * belongs to the world, and a roaster inventing "double anaerobic thermal
 * shock" next season must not need a migration. The stems are English and
 * Slovak both, since Slovak roasters print either.
 *
 * Order matters: the first stem that matches wins, so the specific ones come
 * before the general ones they contain. "Anaeróbne natural" is an anaerobic
 * lot, not a plain natural, and "wet hulled" is not a washed coffee however
 * much the word "wet" suggests it.
 */
export const PROCESS_SIGNALS: readonly (readonly [string, PartialTasteAxes])[] = [
  /** Ferments under pressure with no oxygen. Loud, sweet, often barely tastes of origin. */
  ['anaerob', { acidity: 6.5, sweetness: 9, body: 7, intensity: 8.5 }],
  ['carbonic', { acidity: 6.5, sweetness: 9, body: 7, intensity: 8.5 }],
  ['macerat', { acidity: 6.5, sweetness: 9, body: 7, intensity: 8.5 }],
  ['experiment', { acidity: 6.5, sweetness: 8.5, body: 7, intensity: 8 }],
  /** Indonesia's own method. The reason a Sumatran tastes of earth rather than fruit. */
  ['wet hull', { acidity: 2.5, sweetness: 5, body: 8.5, bitterness: 6, intensity: 7.5 }],
  ['giling', { acidity: 2.5, sweetness: 5, body: 8.5, bitterness: 6, intensity: 7.5 }],
  /** Mucilage left on to dry. Halfway between washed and natural, by design. */
  ['honey', { acidity: 6.5, sweetness: 7.5, body: 6.5 }],
  ['medov', { acidity: 6.5, sweetness: 7.5, body: 6.5 }],
  ['pulped natural', { acidity: 6.5, sweetness: 7.5, body: 6.5 }],
  ['semi wash', { acidity: 5, sweetness: 6.5, body: 6.5 }],
  ['polopran', { acidity: 5, sweetness: 6.5, body: 6.5 }],
  /** Dried in the fruit. Sweet, heavy, jammy, and the least predictable of the three. */
  ['natural', { acidity: 5.5, sweetness: 8.5, body: 7 }],
  ['dry process', { acidity: 5.5, sweetness: 8.5, body: 7 }],
  ['susen', { acidity: 5.5, sweetness: 8.5, body: 7 }],
  /** Fruit removed before drying. Clean, bright, and what most specialty coffee is. */
  ['wash', { acidity: 7.5, sweetness: 5.5, body: 4.5, bitterness: 3.5 }],
  ['pran', { acidity: 7.5, sweetness: 5.5, body: 4.5, bitterness: 3.5 }],
];
