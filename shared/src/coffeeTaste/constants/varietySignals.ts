import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * The varieties that actually taste of something in particular.
 *
 * Deliberately short. Most variety names on most bags - Caturra, Catuai,
 * Typica and the rest - describe a plant that yields a cup indistinguishable
 * from its neighbours once the farm, the process and the roast have had their
 * say, and inventing a signal for each of them would be five decimal places of
 * nothing. What is here is the handful where the genetics really do carry
 * through: Gesha's floral lightness, SL28's blackcurrant acidity, Pacamara's
 * size and weight, and the fact that a Robusta is a different species.
 *
 * Matched on a stem against the normalised variety text.
 */
export const VARIETY_SIGNALS: readonly (readonly [string, PartialTasteAxes])[] = [
  /** A different species, and the only entry here that changes the drink outright. */
  ['robusta', { acidity: 2, sweetness: 4, body: 8.5, bitterness: 8.5, intensity: 9 }],
  ['canephor', { acidity: 2, sweetness: 4, body: 8.5, bitterness: 8.5, intensity: 9 }],
  /** Tea-like, floral, and the reason people pay what they pay for it. */
  ['gesha', { acidity: 8.5, sweetness: 7.5, body: 3.5, intensity: 5.5 }],
  ['geisha', { acidity: 8.5, sweetness: 7.5, body: 3.5, intensity: 5.5 }],
  /** The Kenyan selections, and where blackcurrant acidity comes from. */
  ['sl28', { acidity: 8.5, sweetness: 6.5, body: 6.5 }],
  ['sl34', { acidity: 8, sweetness: 6.5, body: 6.5 }],
  /** Big beans, big body. */
  ['pacamara', { acidity: 6.5, sweetness: 7, body: 7.5, intensity: 7 }],
  ['maragogyp', { acidity: 6, sweetness: 6.5, body: 7.5 }],
  /** Ethiopian landraces: the floral, tea-like end, whatever else is on the bag. */
  ['heirloom', { acidity: 7.5, sweetness: 7, body: 4.5 }],
  ['landrac', { acidity: 7.5, sweetness: 7, body: 4.5 }],
  /** Sweet and rounded, and the parent of half the list. */
  ['bourbon', { acidity: 6.5, sweetness: 7.5, body: 6.5 }],
];
