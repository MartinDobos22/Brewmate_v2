import type { BrewMethod } from '@brewmate/shared';

import { useBrewMethods } from '../../brewing/hooks';

const NONE: readonly BrewMethod[] = [];

export interface BrewMethodCatalog {
  readonly methods: readonly BrewMethod[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => void;
}

/** The method catalogue as a list, with the three states a screen has to draw. */
export const useBrewMethodCatalog = (): BrewMethodCatalog => {
  const query = useBrewMethods();

  return {
    methods: query.data?.items ?? NONE,
    isLoading: query.isPending,
    isError: query.isError,
    refetch: (): void => {
      void query.refetch();
    },
  };
};
