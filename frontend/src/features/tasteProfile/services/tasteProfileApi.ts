import {
  API_ROUTES,
  listResponseSchema,
  tasteProfileEventSchema,
  tasteProfileSchema,
  type CreateTasteProfileEventRequest,
  type ListFilter,
  type ListResponse,
  type TasteProfile,
  type TasteProfileEvent,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const EMPTY_BODY = {};

export const fetchTasteProfile = async (): Promise<TasteProfile> =>
  getApiClient().request({ path: API_ROUTES.tasteProfile, schema: tasteProfileSchema });

/** The audit trail the profile is folded from, newest first. */
export const fetchTasteProfileEvents = async (
  filter?: ListFilter,
): Promise<ListResponse<TasteProfileEvent>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.tasteProfileEvents, filter),
    schema: listResponseSchema(tasteProfileEventSchema),
  });

/**
 * Appends an observation.
 *
 * Naming what produced it makes the call safe to retry: the API answers with
 * the event that already exists rather than counting the evidence twice.
 */
export const addTasteProfileEvent = async (
  input: CreateTasteProfileEventRequest,
): Promise<TasteProfileEvent> =>
  getApiClient().request({
    path: API_ROUTES.tasteProfileEvents,
    method: HTTP_METHODS.post,
    body: input,
    schema: tasteProfileEventSchema,
  });

/** Rebuilds the profile from its events. Running it twice changes nothing. */
export const recomputeTasteProfile = async (): Promise<TasteProfile> =>
  getApiClient().request({
    path: API_ROUTES.tasteProfileRecompute,
    method: HTTP_METHODS.post,
    body: EMPTY_BODY,
    schema: tasteProfileSchema,
  });
