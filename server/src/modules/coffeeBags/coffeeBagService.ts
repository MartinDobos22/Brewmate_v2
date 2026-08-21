import type {
  CoffeeBag,
  CoffeeBagQuery,
  CreateCoffeeBagRequest,
  ListResponse,
  UpdateCoffeeBagRequest,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import type { NewCoffeeBagRow } from '../../db/schema/coffeeBagsTable.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';

import { toCoffeeBag } from './coffeeBagMapper.js';
import type { CoffeeBagRepository } from './coffeeBagRepository.js';
import { resolveRemainingGrams } from './resolveRemainingGrams.js';

const ARCHIVED = true;

export interface CoffeeBagService {
  list(userId: string, query: CoffeeBagQuery): Promise<ListResponse<CoffeeBag>>;
  getById(userId: string, id: string): Promise<CoffeeBag>;
  create(userId: string, input: CreateCoffeeBagRequest): Promise<CoffeeBag>;
  update(userId: string, id: string, changes: UpdateCoffeeBagRequest): Promise<CoffeeBag>;
  /** Archives rather than erases; brew logs point at this row. */
  archive(userId: string, id: string): Promise<CoffeeBag>;
}

export const createCoffeeBagService = (repository: CoffeeBagRepository): CoffeeBagService => {
  const requireOwned = async (userId: string, id: string): Promise<CoffeeBag> => {
    const row = await repository.findById(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
    }

    return toCoffeeBag(row);
  };

  const requireUpdated = async (
    userId: string,
    id: string,
    changes: Partial<NewCoffeeBagRow>,
  ): Promise<CoffeeBag> => {
    const row = await repository.updateById(id, userId, changes);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
    }

    return toCoffeeBag(row);
  };

  return {
    getById: requireOwned,

    list: async (userId, { limit, offset, includeArchived }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset, includeArchived })).map(toCoffeeBag),
        limit,
        offset,
      }),

    create: async (userId, input) =>
      toCoffeeBag(
        await repository.create({
          ...input,
          userId,
          remainingGrams: resolveRemainingGrams({
            weightGrams: input.weightGrams ?? null,
            remainingGrams: input.remainingGrams ?? null,
          }),
        }),
      ),

    /**
     * The amounts are checked against the state the row will be in after the
     * patch, not against the half of it that happens to be in the body.
     */
    update: async (userId, id, changes): Promise<CoffeeBag> => {
      const current = await requireOwned(userId, id);
      const weightGrams = changes.weightGrams ?? current.weightGrams;

      return requireUpdated(userId, id, {
        ...changes,
        weightGrams,
        remainingGrams: resolveRemainingGrams({
          weightGrams,
          remainingGrams: changes.remainingGrams ?? current.remainingGrams,
        }),
      });
    },

    archive: async (userId, id) => requireUpdated(userId, id, { isArchived: ARCHIVED }),
  };
};
