import { QueryClient } from '@tanstack/react-query';

import { LIMITS } from '../../constants/limits';

/** One query client for the app, configured from the shared limits. */
export const createAppQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: LIMITS.queryStaleTimeMs,
        gcTime: LIMITS.queryGcTimeMs,
        retry: LIMITS.queryRetryCount,
        refetchOnWindowFocus: false,
      },
    },
  });
