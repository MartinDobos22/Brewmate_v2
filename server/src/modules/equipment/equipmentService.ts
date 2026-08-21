import type {
  CreateEquipmentRequest,
  DeletedResponse,
  Equipment,
  EquipmentQuery,
  ListResponse,
  UpdateEquipmentRequest,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import type { EquipmentSetRepository } from '../equipmentSets/equipmentSetRepository.js';

import { toEquipment } from './equipmentMapper.js';
import type { EquipmentRepository } from './equipmentRepository.js';

export interface EquipmentService {
  list(userId: string, query: EquipmentQuery): Promise<ListResponse<Equipment>>;
  getById(userId: string, id: string): Promise<Equipment>;
  create(userId: string, input: CreateEquipmentRequest): Promise<Equipment>;
  update(userId: string, id: string, changes: UpdateEquipmentRequest): Promise<Equipment>;
  remove(userId: string, id: string): Promise<DeletedResponse>;
}

export const createEquipmentService = (
  repository: EquipmentRepository,
  equipmentSetRepository: EquipmentSetRepository,
): EquipmentService => {
  const requireOwned = async (userId: string, id: string): Promise<Equipment> => {
    const row = await repository.findById(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.equipmentNotFound);
    }

    return toEquipment(row);
  };

  return {
    getById: requireOwned,

    list: async (userId, { limit, offset, type, activeOnly }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset, type, activeOnly })).map(toEquipment),
        limit,
        offset,
      }),

    create: async (userId, input) => toEquipment(await repository.create({ ...input, userId })),

    update: async (userId, id, changes): Promise<Equipment> => {
      const row = await repository.updateById(id, userId, changes);

      if (row === null) {
        throw notFoundError(ERROR_MESSAGES.equipmentNotFound);
      }

      return toEquipment(row);
    },

    /**
     * Equipment sets name their contents in a jsonb array, which no foreign key
     * watches over. Pruning the id out of them here is what keeps a set from
     * pointing at a grinder that no longer exists.
     */
    remove: async (userId, id): Promise<DeletedResponse> => {
      const deleted = await repository.deleteById(id, userId);

      if (!deleted) {
        throw notFoundError(ERROR_MESSAGES.equipmentNotFound);
      }

      await equipmentSetRepository.pruneEquipmentId(id, userId);

      return { id, deletedAt: new Date().toISOString() };
    },
  };
};
