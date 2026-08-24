import type { UseMutationResult } from '@tanstack/react-query';
import {
  ANALYTICS_EVENT_NAMES,
  type EspressoDialInRequest,
  type EspressoDialInResponse,
} from '@brewmate/shared';

import { QUERY_ROOTS } from '../../../constants/queryKeys';
import { useInvalidatingMutation } from '../../../hooks/useEntityMutation';
import { sendShot } from '../services/espressoDialInApi';

/**
 * One shot, sent with what it tasted like.
 *
 * Never optimistic. The brew logs are invalidated because the server has just
 * written one - the timeline on this screen is drawn from those rows rather
 * than from anything the screen kept, so closing the app halfway through a
 * dial-in loses nothing.
 */
export const useSendShot = (): UseMutationResult<
  EspressoDialInResponse,
  Error,
  EspressoDialInRequest
> =>
  useInvalidatingMutation({
    mutationFn: sendShot,
    invalidates: [
      QUERY_ROOTS.brewLogs,
      QUERY_ROOTS.recipeMessages,
      QUERY_ROOTS.tasteProfile,
      QUERY_ROOTS.tasteProfileEvents,
      QUERY_ROOTS.aiUsage,
    ],
    tracks: ANALYTICS_EVENT_NAMES.dialInShotLogged,
  });
