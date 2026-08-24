import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { AnalyticsEventName } from '@brewmate/shared';

import type { AppQueryKey } from '../../constants/queryKeys';
import { trackEvent } from '../../lib/analytics';

export interface InvalidatingMutationOptions<TVariables, TResult> {
  readonly mutationFn: (variables: TVariables) => Promise<TResult>;
  /** Domain roots to refetch once the server has answered. */
  readonly invalidates: readonly AppQueryKey[];
  /**
   * The flow step this write completes, recorded once it has.
   *
   * Declared here rather than called at each screen, because the moment worth
   * counting is the server having said yes - not the tap. A funnel built from
   * taps counts intentions, and half the interesting question is how often an
   * intention fails.
   */
  readonly tracks?: AnalyticsEventName;
}

/**
 * A write whose result the app cannot honestly predict.
 *
 * Creating a recipe, logging a brew or recording a taste event all have
 * outcomes the server decides - an id, a derived bag, a learning weight priced
 * from the declared constraints, a whole recomputed profile. Showing a guess
 * would mean showing something that is about to change, so these wait for the
 * answer and then invalidate what it touched.
 */
export const useInvalidatingMutation = <TVariables, TResult>({
  mutationFn,
  invalidates,
  tracks,
}: InvalidatingMutationOptions<TVariables, TResult>): UseMutationResult<
  TResult,
  Error,
  TVariables
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (): Promise<void> => {
      if (tracks !== undefined) {
        trackEvent(tracks);
      }

      await Promise.all(
        invalidates.map(async (queryKey: AppQueryKey): Promise<void> =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
  });
};
