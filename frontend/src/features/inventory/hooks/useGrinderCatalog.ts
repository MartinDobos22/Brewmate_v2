import { useState } from 'react';
import type { Grinder, GrinderTypicalUse } from '@brewmate/shared';

import { LIMITS } from '../../../constants/limits';
import { useDebouncedValue } from '../../../hooks';

import { useGrinders } from './useGrinders';

const EMPTY = '';
const NO_RESULTS: readonly Grinder[] = [];

export interface GrinderCatalog {
  readonly search: string;
  readonly setSearch: (search: string) => void;
  /** `null` is "every kind of grinder", which is why it is not a use itself. */
  readonly typicalUse: GrinderTypicalUse | null;
  readonly setTypicalUse: (typicalUse: GrinderTypicalUse | null) => void;
  readonly items: readonly Grinder[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isFiltered: boolean;
  readonly refetch: () => void;
}

/**
 * The catalogue as the screen needs it: a search box, a filter, and whatever
 * the API answered for the two of them together.
 *
 * The search is debounced rather than sent per keystroke, and it travels in
 * the query key, so every term keeps its own cache entry and going back to a
 * previous one is instant.
 */
export const useGrinderCatalog = (): GrinderCatalog => {
  const [search, setSearch] = useState(EMPTY);
  const [typicalUse, setTypicalUse] = useState<GrinderTypicalUse | null>(null);
  const settledSearch = useDebouncedValue(search.trim(), LIMITS.searchDebounceMs);
  const query = useGrinders({
    search: settledSearch === EMPTY ? undefined : settledSearch,
    typicalUse: typicalUse ?? undefined,
  });

  return {
    search,
    setSearch,
    typicalUse,
    setTypicalUse,
    items: query.data?.items ?? NO_RESULTS,
    isLoading: query.isPending,
    isError: query.isError,
    isFiltered: settledSearch !== EMPTY || typicalUse !== null,
    refetch: (): void => {
      void query.refetch();
    },
  };
};
