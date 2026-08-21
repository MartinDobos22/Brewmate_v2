import {
  API_ROUTES,
  buildApiPath,
  deletedResponseSchema,
  equipmentSetSchema,
  listResponseSchema,
  type CreateEquipmentSetRequest,
  type DeletedResponse,
  type EquipmentSet,
  type ListFilter,
  type ListResponse,
  type UpdateEquipmentSetRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const setPath = (id: string): string => buildApiPath(API_ROUTES.equipmentSetById, { id });

export const fetchEquipmentSets = async (
  filter?: ListFilter,
): Promise<ListResponse<EquipmentSet>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.equipmentSets, filter),
    schema: listResponseSchema(equipmentSetSchema),
  });

export const fetchEquipmentSet = async (id: string): Promise<EquipmentSet> =>
  getApiClient().request({ path: setPath(id), schema: equipmentSetSchema });

export const createEquipmentSet = async (input: CreateEquipmentSetRequest): Promise<EquipmentSet> =>
  getApiClient().request({
    path: API_ROUTES.equipmentSets,
    method: HTTP_METHODS.post,
    body: input,
    schema: equipmentSetSchema,
  });

export const updateEquipmentSet = async (
  id: string,
  changes: UpdateEquipmentSetRequest,
): Promise<EquipmentSet> =>
  getApiClient().request({
    path: setPath(id),
    method: HTTP_METHODS.patch,
    body: changes,
    schema: equipmentSetSchema,
  });

export const deleteEquipmentSet = async (id: string): Promise<DeletedResponse> =>
  getApiClient().request({
    path: setPath(id),
    method: HTTP_METHODS.delete,
    schema: deletedResponseSchema,
  });
