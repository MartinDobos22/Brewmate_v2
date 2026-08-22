import type { UseMutationResult } from '@tanstack/react-query';
import type { TasteProfile } from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { recomputeTasteProfile } from '../services/tasteProfileApi';

/** Rebuilds the profile from its events. Safe to press twice. */
export const useRecomputeTasteProfile = (): UseMutationResult<TasteProfile, Error, void> =>
  useInvalidatingMutation({
    mutationFn: recomputeTasteProfile,
    invalidates: [QUERY_ROOTS.tasteProfile, QUERY_ROOTS.tasteProfileEvents],
  });
