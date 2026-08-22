import type {
  CreateEquipmentSetRequest,
  DeletedResponse,
  EquipmentSet,
  ListQuery,
  ListResponse,
  UpdateEquipmentSetRequest,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { badRequestError } from '../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import type { EquipmentRepository } from '../equipment/equipmentRepository.js';

import { toEquipmentSet } from './equipmentSetMapper.js';
import type { EquipmentSetRepository } from './equipmentSetRepository.js';

const NOT_DEFAULT = false;

export interface EquipmentSetService {
  list(userId: string, query: ListQuery): Promise<ListResponse<EquipmentSet>>;
  getById(userId: string, id: string): Promise<EquipmentSet>;
  create(userId: string, input: CreateEquipmentSetRequest): Promise<EquipmentSet>;
  update(userId: string, id: string, changes: UpdateEquipmentSetRequest): Promise<EquipmentSet>;
  remove(userId: string, id: string): Promise<DeletedResponse>;
}

export const createEquipmentSetService = (
  repository: EquipmentSetRepository,
  equipmentRepository: EquipmentRepository,
): EquipmentSetService => {
  /**
   * The check a foreign key would have made.
   *
   * `equipment_ids` is jsonb, so the database cannot refuse a set that names
   * equipment which does not exist - or worse, somebody else's. Both cases end
   * up here, and both are rejected the same way.
   */
  const requireOwnedEquipment = async (
    userId: string,
    equipmentIds: readonly string[],
  ): Promise<void> => {
    const owned = await equipmentRepository.findOwnedIds(equipmentIds, userId);

    if (owned.length !== new Set(equipmentIds).size) {
      throw badRequestError(ERROR_MESSAGES.unknownEquipmentInSet);
    }
  };

  const requireOwned = async (userId: string, id: string): Promise<EquipmentSet> => {
    const row = await repository.findById(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.equipmentSetNotFound);
    }

    return toEquipmentSet(row);
  };

  /** A set is only default after the previous default has been cleared. */
  const applyDefault = async (userId: string, id: string): Promise<EquipmentSet> => {
    const row = await repository.makeDefault(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.equipmentSetNotFound);
    }

    return toEquipmentSet(row);
  };

  return {
    getById: requireOwned,

    list: async (userId, { limit, offset }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset })).map(toEquipmentSet),
        limit,
        offset,
      }),

    /**
     * The row is written without the default flag and promoted afterwards.
     * Writing `isDefault` directly would collide with the partial unique index
     * against whichever set is default today, which is a race, not a rule.
     */
    create: async (userId, { isDefault, ...input }): Promise<EquipmentSet> => {
      await requireOwnedEquipment(userId, input.equipmentIds);

      const created = toEquipmentSet(
        await repository.create({ ...input, isDefault: NOT_DEFAULT, userId }),
      );

      return isDefault === true ? applyDefault(userId, created.id) : created;
    },

    update: async (userId, id, { isDefault, ...changes }): Promise<EquipmentSet> => {
      if (changes.equipmentIds !== undefined) {
        await requireOwnedEquipment(userId, changes.equipmentIds);
      }

      const row = await repository.updateById(id, userId, {
        ...changes,
        ...(isDefault === undefined ? {} : { isDefault: NOT_DEFAULT }),
      });

      if (row === null) {
        throw notFoundError(ERROR_MESSAGES.equipmentSetNotFound);
      }

      return isDefault === true ? applyDefault(userId, id) : toEquipmentSet(row);
    },

    remove: async (userId, id): Promise<DeletedResponse> => {
      if (!(await repository.deleteById(id, userId))) {
        throw notFoundError(ERROR_MESSAGES.equipmentSetNotFound);
      }

      return { id, deletedAt: new Date().toISOString() };
    },
  };
};
