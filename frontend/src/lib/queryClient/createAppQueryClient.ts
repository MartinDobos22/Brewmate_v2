import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { LIMITS } from '../../constants/limits';

import { reportQueryFailure } from './reportQueryFailure';

const UNKNOWN_ACTION = 'unknown';

/**
 * The domain a failure belongs to, and nothing more specific.
 *
 * A query key's first element is the domain name; everything after it is a
 * filter or an id. Only the root is reported, so a crash report can say
 * "recipes" without carrying which recipe - a report is a description of a
 * bug, not a record of what somebody was reading.
 */
const readDomain = (key: unknown): string => (typeof key === 'string' ? key : UNKNOWN_ACTION);

/**
 * One query client for the app, configured from the shared limits.
 *
 * Both caches carry an `onError`, which is the only place in the app that
 * decides a failure is worth reporting to anybody but the person in front of
 * it. Doing it here rather than per screen means a new screen cannot forget,
 * and the rule about what deserves reporting is written down once.
 *
 * The action recorded is the query key's root or the mutation's key - a domain
 * name like `recipes`, never an id and never anything somebody typed.
 */
export const createAppQueryClient = (): QueryClient =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error: Error, query): void => {
        reportQueryFailure(error, readDomain(query.queryKey[0]));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: Error, _variables, _context, mutation): void => {
        reportQueryFailure(error, readDomain(mutation.options.mutationKey?.[0]));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: LIMITS.queryStaleTimeMs,
        gcTime: LIMITS.queryGcTimeMs,
        retry: LIMITS.queryRetryCount,
        refetchOnWindowFocus: false,
      },
    },
  });
