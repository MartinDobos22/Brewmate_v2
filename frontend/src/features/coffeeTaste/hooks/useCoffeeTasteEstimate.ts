import {
  estimateCoffeeTaste as foldEstimate,
  readCoffeeSignals,
  type CoffeeLabelFacts,
  type CoffeeTasteEstimate,
  type ParsedBagData,
} from '@brewmate/shared';
import { useQuery } from '@tanstack/react-query';

import { coffeeTasteEstimateQuery } from '../services/coffeeTasteEstimateQuery';

const NO_NOTES: readonly string[] = [];

export interface CoffeeTasteReadout {
  /** Always present: the label's own arithmetic, refined once the server answers. */
  readonly estimate: CoffeeTasteEstimate;
  /** Two Slovak sentences, once a model has written them. Null until then. */
  readonly summary: string | null;
  readonly flavourNotes: readonly string[];
  /** True while the closer reading is on its way, so the card can say so. */
  readonly isRefining: boolean;
}

/**
 * What this coffee tastes like.
 *
 * The estimate is computed on the phone first, from the label alone, and it is
 * on screen before any request is made. That ordering is the feature rather
 * than an optimisation: this is used standing in a shop with a bag in one hand
 * and one bar of signal, and it is also what somebody watches change as they
 * type a coffee into the form by hand. A screen that waited for a server to
 * tell it that a dark roast is bitter would be worse in every case.
 *
 * The server is then asked for the part the tables cannot do - an unfamiliar
 * note, a region a country name does not carry, a label in another language -
 * and for the two Slovak sentences that describe the cup. If that never
 * arrives, because there is no signal or the allowance is spent, nothing is
 * lost: the shape stays, and one line of prose is missing.
 *
 * Keyed by the label rather than by a bag, so the same coffee asked about from
 * a shelf and from the cupboard is one question with one answer.
 */
export const useCoffeeTasteEstimate = (
  coffee: ParsedBagData & CoffeeLabelFacts,
  enabled = true,
): CoffeeTasteReadout => {
  const local = foldEstimate(readCoffeeSignals(coffee));
  const query = useQuery({ ...coffeeTasteEstimateQuery(coffee), enabled });

  return {
    estimate: query.data?.estimate ?? local,
    summary: query.data?.summary ?? null,
    flavourNotes: query.data?.flavourNotes ?? NO_NOTES,
    isRefining: query.isFetching,
  };
};
