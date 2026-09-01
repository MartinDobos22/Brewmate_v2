import {
  API_ROUTES,
  estimateCoffeeTasteResponseSchema,
  type EstimateCoffeeTasteRequest,
  type EstimateCoffeeTasteResponse,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient } from '../../../lib/apiClient';

/**
 * Asks the server to read this label more closely than the app can.
 *
 * Only the coffee travels and nothing about the person does, which is what
 * lets the answer be cached and shared: the same bag tastes the same for
 * everybody, and only the verdict beside it is personal.
 */
export const estimateCoffeeTaste = async (
  input: EstimateCoffeeTasteRequest,
): Promise<EstimateCoffeeTasteResponse> =>
  getApiClient().request({
    path: API_ROUTES.aiEstimateCoffeeTaste,
    method: HTTP_METHODS.post,
    body: input,
    schema: estimateCoffeeTasteResponseSchema,
  });
