import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * What a growing country tends to taste like, before anything else is known.
 *
 * The weakest of the strong signals and the widest generalisation in this
 * module, which is exactly why it is weighted low: "Brazília" covers a
 * chocolate-heavy commodity lot and a competition-winning natural, and both
 * are on shelves. It earns its place because it is often the only thing a bag
 * prints besides a name, and a country-level prior is a great deal better than
 * the middle of the scale.
 *
 * Matched on a stem against the normalised country text, so the Slovak and the
 * English name of a country both land on the same row. The list is the
 * origins a Slovak specialty shelf actually carries; anything not on it
 * contributes nothing rather than a guess, which is the honest outcome.
 */
export const ORIGIN_SIGNALS: readonly (readonly [string, PartialTasteAxes])[] = [
  /** East Africa: the bright end of the shelf. */
  ['etiop', { acidity: 8, sweetness: 7, body: 4 }],
  ['ethiop', { acidity: 8, sweetness: 7, body: 4 }],
  ['ken', { acidity: 8.5, sweetness: 6.5, body: 6.5 }],
  ['rwand', { acidity: 7.5, sweetness: 6.5, body: 5 }],
  ['burund', { acidity: 7.5, sweetness: 6.5, body: 5 }],
  ['tanzan', { acidity: 7.5, sweetness: 6, body: 5.5 }],
  ['ugand', { acidity: 5.5, sweetness: 6, body: 6.5 }],
  /** Central America: the balanced middle most roasters build a house blend on. */
  ['kolumb', { acidity: 6.5, sweetness: 7, body: 6 }],
  ['colomb', { acidity: 6.5, sweetness: 7, body: 6 }],
  ['guatemal', { acidity: 6.5, sweetness: 6.5, body: 6.5 }],
  ['kostarik', { acidity: 7, sweetness: 7, body: 5.5 }],
  ['costa ric', { acidity: 7, sweetness: 7, body: 5.5 }],
  ['salvador', { acidity: 6, sweetness: 7, body: 6 }],
  ['hondur', { acidity: 6, sweetness: 7, body: 6 }],
  ['nikarag', { acidity: 6, sweetness: 6.5, body: 6 }],
  ['nicarag', { acidity: 6, sweetness: 6.5, body: 6 }],
  ['panam', { acidity: 7.5, sweetness: 7, body: 4.5 }],
  ['mexik', { acidity: 5.5, sweetness: 6, body: 5.5 }],
  ['mexic', { acidity: 5.5, sweetness: 6, body: 5.5 }],
  /** South America: the heavy, sweet, low-acid end. */
  ['brazil', { acidity: 3.5, sweetness: 7, body: 7.5, bitterness: 5 }],
  ['peru', { acidity: 5.5, sweetness: 6.5, body: 5.5 }],
  ['boliv', { acidity: 6, sweetness: 6.5, body: 5.5 }],
  ['ekvad', { acidity: 6.5, sweetness: 6.5, body: 5.5 }],
  ['ecuad', { acidity: 6.5, sweetness: 6.5, body: 5.5 }],
  /** Asia and the Pacific: earthy, heavy, and the lowest acidity on any shelf. */
  ['indonez', { acidity: 2.5, sweetness: 5.5, body: 8.5, bitterness: 6 }],
  ['indones', { acidity: 2.5, sweetness: 5.5, body: 8.5, bitterness: 6 }],
  ['sumatr', { acidity: 2.5, sweetness: 5.5, body: 8.5, bitterness: 6 }],
  ['java', { acidity: 3.5, sweetness: 5.5, body: 8, bitterness: 5.5 }],
  ['sulawes', { acidity: 3.5, sweetness: 6, body: 8 }],
  ['papu', { acidity: 5.5, sweetness: 6, body: 6.5 }],
  ['vietnam', { acidity: 2.5, sweetness: 4.5, body: 8, bitterness: 7, intensity: 8 }],
  ['india', { acidity: 3.5, sweetness: 5.5, body: 8, bitterness: 6 }],
  ['jemen', { acidity: 6, sweetness: 7, body: 7.5, intensity: 8 }],
  ['yemen', { acidity: 6, sweetness: 7, body: 7.5, intensity: 8 }],
];
