import type {
  CreateRecipeRequest,
  DeletedResponse,
  ListResponse,
  Recipe,
  RecipeQuery,
  UpdateRecipeRequest,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import type { NewRecipeRow } from '../../db/schema/recipesTable.js';
import { badRequestError } from '../../errors/badRequestError.js';
import { conflictError } from '../../errors/conflictError.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import type { BrewLogRepository } from '../brewLogs/brewLogRepository.js';
import type { BrewMethodService } from '../brewMethods/brewMethodService.js';
import type { CoffeeBagRepository } from '../coffeeBags/coffeeBagRepository.js';
import type { EquipmentRepository } from '../equipment/equipmentRepository.js';

import { toRecipe } from './recipeMapper.js';
import type { RecipeRepository } from './recipeRepository.js';

const NO_LOGS = 0;
const NOT_PINNED = false;

export interface RecipeServiceDependencies {
  readonly repository: RecipeRepository;
  readonly brewMethodService: BrewMethodService;
  readonly coffeeBagRepository: CoffeeBagRepository;
  readonly equipmentRepository: EquipmentRepository;
  readonly brewLogRepository: BrewLogRepository;
}

export interface RecipeService {
  list(userId: string, query: RecipeQuery): Promise<ListResponse<Recipe>>;
  getById(userId: string, id: string): Promise<Recipe>;
  create(userId: string, input: CreateRecipeRequest): Promise<Recipe>;
  update(userId: string, id: string, changes: UpdateRecipeRequest): Promise<Recipe>;
  remove(userId: string, id: string): Promise<DeletedResponse>;
  /** Resolves the recipe a caller owns, for the modules that hang off one. */
  requireOwned(userId: string, id: string): Promise<Recipe>;
}

export const createRecipeService = ({
  repository,
  brewMethodService,
  coffeeBagRepository,
  equipmentRepository,
  brewLogRepository,
}: RecipeServiceDependencies): RecipeService => {
  const requireOwned = async (userId: string, id: string): Promise<Recipe> => {
    const row = await repository.findById(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.recipeNotFound);
    }

    return toRecipe(row);
  };

  /**
   * Every reference in the body has to be checked against this caller, not
   * merely against the database: a foreign key would happily accept somebody
   * else's bag.
   */
  const requireReferences = async (
    userId: string,
    input: Partial<CreateRecipeRequest>,
  ): Promise<void> => {
    if (input.methodId !== undefined) {
      await brewMethodService.requireUsable(input.methodId);
    }

    if (input.bagId !== undefined && input.bagId !== null) {
      if ((await coffeeBagRepository.findById(input.bagId, userId)) === null) {
        throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
      }
    }

    if (input.parentRecipeId !== undefined && input.parentRecipeId !== null) {
      if ((await repository.findById(input.parentRecipeId, userId)) === null) {
        throw notFoundError(ERROR_MESSAGES.parentRecipeNotFound);
      }
    }

    if (input.equipmentIds !== undefined) {
      const owned = await equipmentRepository.findOwnedIds(input.equipmentIds, userId);

      if (owned.length !== new Set(input.equipmentIds).size) {
        throw badRequestError(ERROR_MESSAGES.unknownEquipmentInSet);
      }
    }
  };

  /**
   * Pinning is a transaction, not a flag: the previous favourite for the same
   * (bag, method) pair has to let go first. Writing `is_pinned` straight into
   * the row would race the partial unique index instead of respecting it.
   */
  const applyPin = async (userId: string, id: string): Promise<Recipe> => {
    const row = await repository.pin(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.recipeNotFound);
    }

    return toRecipe(row);
  };

  const write = async (
    userId: string,
    id: string,
    changes: Partial<NewRecipeRow>,
  ): Promise<Recipe> => {
    const row = await repository.updateById(id, userId, changes);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.recipeNotFound);
    }

    return toRecipe(row);
  };

  return {
    requireOwned,
    getById: requireOwned,

    list: async (userId, { limit, offset, bagId, methodId, savedOnly, pinnedOnly }) =>
      toPage({
        rows: (
          await repository.list({ userId, limit, offset, bagId, methodId, savedOnly, pinnedOnly })
        ).map(toRecipe),
        limit,
        offset,
      }),

    create: async (userId, { isPinned, ...input }): Promise<Recipe> => {
      await requireReferences(userId, input);

      const created = toRecipe(await repository.create({ ...input, isPinned: NOT_PINNED, userId }));

      return isPinned === true ? applyPin(userId, created.id) : created;
    },

    update: async (userId, id, { isPinned, ...changes }): Promise<Recipe> => {
      await requireReferences(userId, changes);

      const updated = await write(userId, id, {
        ...changes,
        ...(isPinned === undefined ? {} : { isPinned: NOT_PINNED }),
      });

      return isPinned === true ? applyPin(userId, id) : updated;
    },

    /**
     * A brew log without its recipe is a log of nothing, so the recipe stays.
     * The foreign key cascades instead of restricting on purpose - deleting an
     * account must never deadlock against its own history - which is exactly
     * why this rule has to be enforced here.
     */
    remove: async (userId, id): Promise<DeletedResponse> => {
      if ((await brewLogRepository.countByRecipe(id, userId)) > NO_LOGS) {
        throw conflictError(ERROR_MESSAGES.recipeHasBrewLogs);
      }

      if (!(await repository.deleteById(id, userId))) {
        throw notFoundError(ERROR_MESSAGES.recipeNotFound);
      }

      return { id, deletedAt: new Date().toISOString() };
    },
  };
};
