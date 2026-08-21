import {
  API_ROUTES,
  buildApiPath,
  deletedResponseSchema,
  equipmentSchema,
  listResponseSchema,
  type CreateEquipmentRequest,
  type DeletedResponse,
  type Equipment,
  type EquipmentFilter,
  type ListResponse,
  type UpdateEquipmentRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const equipmentPath = (id: string): string => buildApiPath(API_ROUTES.equipmentById, { id });

export const fetchEquipmentList = async (
  filter?: EquipmentFilter,
): Promise<ListResponse<Equipment>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.equipment, filter),
    schema: listResponseSchema(equipmentSchema),
  });

export const fetchEquipmentItem = async (id: string): Promise<Equipment> =>
  getApiClient().request({ path: equipmentPath(id), schema: equipmentSchema });

export const createEquipment = async (input: CreateEquipmentRequest): Promise<Equipment> =>
  getApiClient().request({
    path: API_ROUTES.equipment,
    method: HTTP_METHODS.post,
    body: input,
    schema: equipmentSchema,
  });

export const updateEquipment = async (
  id: string,
  changes: UpdateEquipmentRequest,
): Promise<Equipment> =>
  getApiClient().request({
    path: equipmentPath(id),
    method: HTTP_METHODS.patch,
    body: changes,
    schema: equipmentSchema,
  });

/** Deleting also prunes the piece out of every set that named it. */
export const deleteEquipment = async (id: string): Promise<DeletedResponse> =>
  getApiClient().request({
    path: equipmentPath(id),
    method: HTTP_METHODS.delete,
    schema: deletedResponseSchema,
  });
