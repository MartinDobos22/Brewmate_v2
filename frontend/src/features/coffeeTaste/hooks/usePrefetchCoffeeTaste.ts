import type { CoffeeLabelFacts, ParsedBagData } from '@brewmate/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { coffeeTasteEstimateQuery } from '../services/coffeeTasteEstimateQuery';

/**
 * Reads the label closely before anybody asks what to do about it.
 *
 * The scan used to run in the order the screens appear: read the label, write
 * the verdict, and only then - once the verdict had arrived and the card below
 * it mounted - ask a model what the coffee actually tastes like. Which meant
 * the verdict for a coffee nobody had scanned before was argued from the
 * label's own arithmetic alone, and the closer reading landed in the shared
 * cache one moment after the sentence that needed it. The second person to
 * scan that bag got the better verdict; the first never did.
 *
 * Warming it first costs nothing extra: the same call is made either way, and
 * the answer is cached under the same key, so the card that appears afterwards
 * finds it already there. The verdict simply has more to argue from.
 *
 * Failure is swallowed on purpose. This is an improvement to a verdict that
 * works without it, and letting it take the scan down would be trading the
 * answer for the nicety.
 */
export const usePrefetchCoffeeTaste = (): ((
  coffee: ParsedBagData & CoffeeLabelFacts,
) => Promise<void>) => {
  const client = useQueryClient();

  return useCallback(
    async (coffee: ParsedBagData & CoffeeLabelFacts): Promise<void> => {
      await client.fetchQuery(coffeeTasteEstimateQuery(coffee)).catch((): void => undefined);
    },
    [client],
  );
};
