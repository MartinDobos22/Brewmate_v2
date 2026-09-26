import type { UseMutationResult } from '@tanstack/react-query';
import {
  ANALYTICS_EVENT_NAMES,
  type CoffeeBag,
  type CreateCoffeeBagRequest,
} from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { createCoffeeBag } from '../services/coffeeBagsApi';

/**
 * Adds a bag.
 *
 * Not optimistic: the id and the opening amount are the server's to decide,
 * and a bag drawn on screen before it exists is a bag with no id to tap.
 *
 * The taste profile is refetched with the cupboard, because a bag written down
 * is a coffee somebody chose - and the server has just told the profile so.
 */
export const useCreateCoffeeBag = (): UseMutationResult<CoffeeBag, Error, CreateCoffeeBagRequest> =>
  useInvalidatingMutation({
    mutationFn: createCoffeeBag,
    invalidates: [QUERY_ROOTS.coffeeBags, QUERY_ROOTS.tasteProfile, QUERY_ROOTS.tasteProfileEvents],
    tracks: ANALYTICS_EVENT_NAMES.coffeeBagAdded,
  });
