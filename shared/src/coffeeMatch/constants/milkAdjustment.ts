import { MILK_USAGE_LEVELS, type MilkUsage } from '../../enums/milkUsage.js';
import type { PartialTasteAxes } from '../../tasteProfiles/tasteAxesSchema.js';

/**
 * What milk does to a coffee, on the same five axes.
 *
 * This exists because the two sides of the comparison are measured at
 * different moments. A taste profile describes the cup somebody actually
 * drinks - the questionnaire asks how they take their milk precisely because
 * it changes what a good cup is for them - while a coffee estimate describes
 * the coffee brewed black, which is the only way a label can be read. Compared
 * without this, somebody who always drinks a flat white is told that every
 * bright coffee on the shelf is too sharp for them, when what actually reaches
 * their mouth is a bright coffee with milk in it.
 *
 * The numbers are what milk physically does. Casein binds the acids and fat
 * coats the tongue, so perceived acidity falls furthest; lactose adds
 * sweetness; protein and fat add body; bitterness is masked rather than
 * removed; and the whole thing is a little more dilute than the shot it
 * started as.
 */
export const MILK_SHIFT: Required<PartialTasteAxes> = {
  acidity: -2.5,
  sweetness: 1.5,
  body: 1.5,
  bitterness: -1.5,
  intensity: -0.5,
};

/**
 * How much of that shift applies, by how often the person reaches for milk.
 *
 * "Sometimes" is a quarter rather than a half: somebody who occasionally makes
 * a latte still chooses their beans for the cups they drink black, and moving
 * the whole shelf halfway towards a milk drink on the strength of an
 * occasional one would be the app deciding how they drink their coffee.
 */
export const MILK_SHARE: Record<MilkUsage, number> = {
  [MILK_USAGE_LEVELS.never]: 0,
  [MILK_USAGE_LEVELS.sometimes]: 0.25,
  [MILK_USAGE_LEVELS.often]: 0.7,
  [MILK_USAGE_LEVELS.always]: 1,
};
