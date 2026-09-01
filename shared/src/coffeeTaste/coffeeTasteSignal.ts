import type { PartialTasteAxes } from '../tasteProfiles/tasteAxesSchema.js';

import type { CoffeeSignalSource } from './coffeeSignalSources.js';

/**
 * One thing the label says about how this coffee tastes.
 *
 * Every signal is an absolute reading on the same 0-10 scale the drinker is
 * described on - "a coffee like this sits here" - rather than a nudge.
 * Averaging readings is meaningful; averaging nudges is not, and the whole
 * point of this module is that the estimate and the person can be compared
 * because they are stated in the same terms.
 */
export interface CoffeeTasteSignal {
  readonly source: CoffeeSignalSource;
  readonly axes: PartialTasteAxes;
  /** How far this kind of evidence is trusted, 0..1. */
  readonly weight: number;
}

/**
 * The facts an estimate is built from.
 *
 * Deliberately narrower than a bag or a parsed label: it is exactly the six
 * fields that say anything about flavour, so it is obvious at a glance what
 * the estimate does and does not read. A stored `CoffeeBag` and a
 * `ParsedBagData` both satisfy it without conversion, which is what lets one
 * function serve a bag in the cupboard and a bag on a shelf.
 */
export interface CoffeeLabelFacts {
  readonly originCountry?: string | null;
  readonly variety?: string | null;
  readonly process?: string | null;
  readonly roastLevel?: string | null;
  readonly altitude?: number | null;
  readonly tastingNotes?: readonly string[] | null;
}
