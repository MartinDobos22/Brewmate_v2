import {
  API_ROUTES,
  bagEvaluationSchema,
  buildApiPath,
  listResponseSchema,
  type BagEvaluation,
  type CreateBagEvaluationRequest,
  type ListFilter,
  type ListResponse,
  type UpdateBagEvaluationRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const evaluationPath = (id: string): string => buildApiPath(API_ROUTES.bagEvaluationById, { id });

export const fetchBagEvaluations = async (
  filter?: ListFilter,
): Promise<ListResponse<BagEvaluation>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.bagEvaluations, filter),
    schema: listResponseSchema(bagEvaluationSchema),
  });

export const fetchBagEvaluation = async (id: string): Promise<BagEvaluation> =>
  getApiClient().request({ path: evaluationPath(id), schema: bagEvaluationSchema });

/** The API stamps on how confident the profile was at this moment. */
export const createBagEvaluation = async (
  input: CreateBagEvaluationRequest,
): Promise<BagEvaluation> =>
  getApiClient().request({
    path: API_ROUTES.bagEvaluations,
    method: HTTP_METHODS.post,
    body: input,
    schema: bagEvaluationSchema,
  });

/** Only the outcome is editable; the verdict is a record, not a draft. */
export const updateBagEvaluation = async (
  id: string,
  changes: UpdateBagEvaluationRequest,
): Promise<BagEvaluation> =>
  getApiClient().request({
    path: evaluationPath(id),
    method: HTTP_METHODS.patch,
    body: changes,
    schema: bagEvaluationSchema,
  });
