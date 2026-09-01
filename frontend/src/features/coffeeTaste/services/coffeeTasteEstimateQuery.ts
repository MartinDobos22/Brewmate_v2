import type {
  CoffeeLabelFacts,
  EstimateCoffeeTasteResponse,
  ParsedBagData,
} from '@brewmate/shared';

import { QUERY_KEYS, type AppQueryKey } from '../../../constants/queryKeys';

import { estimateCoffeeTaste } from './coffeeTasteApi';
import { coffeeTasteFingerprint } from './coffeeTasteFingerprint';

export interface CoffeeTasteEstimateQuery {
  readonly queryKey: AppQueryKey;
  readonly queryFn: () => Promise<EstimateCoffeeTasteResponse>;
  /**
   * Never retried, unlike every other query in the app.
   *
   * This one costs a model call, and the server has already retried the model
   * once itself with the validation error handed back. A client that retried
   * on top of that would spend three calls proving the same thing - and the
   * answer it is chasing is a nicety: the estimate is already on screen,
   * folded from the label, before this request is made.
   */
  readonly retry: false;
  /**
   * Never stale, because the key is the input.
   *
   * The fingerprint is built from every field the estimate reads, so the same
   * key cannot describe a different coffee - correcting a roast level produces
   * a different key rather than a stale entry. Refetching would buy an
   * identical answer at full price.
   */
  readonly staleTime: number;
}

/**
 * One place that says how this coffee is asked about.
 *
 * Written down once because two callers need to agree on it exactly: the card
 * that displays the estimate, and the scan that warms it up before asking for
 * a verdict. Two spellings of the key would be two cache entries and two model
 * calls for one bag.
 */
export const coffeeTasteEstimateQuery = (
  coffee: ParsedBagData & CoffeeLabelFacts,
): CoffeeTasteEstimateQuery => ({
  queryKey: QUERY_KEYS.coffeeTasteEstimate(coffeeTasteFingerprint(coffee)),
  queryFn: async (): Promise<EstimateCoffeeTasteResponse> =>
    estimateCoffeeTaste({ parsedData: coffee }),
  retry: false,
  staleTime: Number.POSITIVE_INFINITY,
});
