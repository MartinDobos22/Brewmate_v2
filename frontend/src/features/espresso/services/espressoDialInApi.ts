import {
  API_ROUTES,
  espressoDialInResponseSchema,
  type EspressoDialInRequest,
  type EspressoDialInResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Sends one shot and reads what to change next.
 *
 * The shot and the sentence go together in one request on purpose. Recording
 * the numbers and then asking about them separately would be two round trips
 * at the moment somebody is standing over a cooling espresso, and would leave
 * a shot in the history that nothing ever answered.
 */
export const sendShot = async (input: EspressoDialInRequest): Promise<EspressoDialInResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiEspressoDialIn,
    method: HTTP_METHODS.post,
    body: input,
    schema: espressoDialInResponseSchema,
  });
