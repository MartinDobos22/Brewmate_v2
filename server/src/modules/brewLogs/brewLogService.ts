import type {
  BrewLog,
  BrewLogQuery,
  CreateBrewLogRequest,
  DeletedResponse,
  ListResponse,
  UpdateBrewLogRequest,
  WaterType,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { badRequestError } from '../../errors/badRequestError.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import type { EquipmentSetRepository } from '../equipmentSets/equipmentSetRepository.js';
import type { RecipeService } from '../recipes/recipeService.js';
import type { UserService } from '../users/userService.js';

import { calculateLearningWeight } from './calculateLearningWeight.js';
import { toBrewLog } from './brewLogMapper.js';
import type { BrewLogRepository } from './brewLogRepository.js';

export interface BrewLogServiceDependencies {
  readonly repository: BrewLogRepository;
  readonly recipeService: RecipeService;
  readonly equipmentSetRepository: EquipmentSetRepository;
  readonly userService: UserService;
}

export interface BrewLogService {
  list(userId: string, query: BrewLogQuery): Promise<ListResponse<BrewLog>>;
  getById(userId: string, id: string): Promise<BrewLog>;
  create(userId: string, input: CreateBrewLogRequest): Promise<BrewLog>;
  update(userId: string, id: string, changes: UpdateBrewLogRequest): Promise<BrewLog>;
  remove(userId: string, id: string): Promise<DeletedResponse>;
}

export const createBrewLogService = ({
  repository,
  recipeService,
  equipmentSetRepository,
  userService,
}: BrewLogServiceDependencies): BrewLogService => {
  const requireOwned = async (userId: string, id: string): Promise<BrewLog> => {
    const row = await repository.findById(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.brewLogNotFound);
    }

    return toBrewLog(row);
  };

  const requireOwnedEquipmentSet = async (userId: string, setId: string): Promise<void> => {
    if ((await equipmentSetRepository.findById(setId, userId)) === null) {
      throw notFoundError(ERROR_MESSAGES.equipmentSetNotFound);
    }
  };

  /** The water actually used, falling back to whatever the account runs on. */
  const resolveWaterType = async (
    userId: string,
    declared: WaterType | undefined,
  ): Promise<WaterType> => declared ?? (await userService.getById(userId)).waterType;

  return {
    getById: requireOwned,

    list: async (userId, { limit, offset, bagId, recipeId, equipmentSetId }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset, bagId, recipeId, equipmentSetId })).map(
          toBrewLog,
        ),
        limit,
        offset,
      }),

    /**
     * The bag is taken from the recipe rather than from the body: a log that
     * claimed a different coffee than the recipe it followed would quietly
     * corrupt every conclusion drawn from it later.
     */
    create: async (userId, input): Promise<BrewLog> => {
      const recipe = await recipeService.requireOwned(userId, input.recipeId);

      if (input.bagId !== undefined && input.bagId !== null && input.bagId !== recipe.bagId) {
        throw badRequestError(ERROR_MESSAGES.brewLogBagMismatch);
      }

      if (input.equipmentSetId !== undefined && input.equipmentSetId !== null) {
        await requireOwnedEquipmentSet(userId, input.equipmentSetId);
      }

      const constraints = input.constraints ?? {};

      return toBrewLog(
        await repository.create({
          ...input,
          userId,
          bagId: recipe.bagId,
          constraints,
          waterType: await resolveWaterType(userId, input.waterType),
          profileLearningWeight: calculateLearningWeight(constraints),
        }),
      );
    },

    /**
     * Correcting the constraints re-prices the evidence, because the weight is
     * a function of them and nothing else.
     */
    update: async (userId, id, changes): Promise<BrewLog> => {
      const current = await requireOwned(userId, id);

      if (changes.equipmentSetId !== undefined && changes.equipmentSetId !== null) {
        await requireOwnedEquipmentSet(userId, changes.equipmentSetId);
      }

      const constraints = changes.constraints ?? current.constraints;
      const row = await repository.updateById(id, userId, {
        ...changes,
        bagId: current.bagId,
        constraints,
        profileLearningWeight: calculateLearningWeight(constraints),
      });

      if (row === null) {
        throw notFoundError(ERROR_MESSAGES.brewLogNotFound);
      }

      return toBrewLog(row);
    },

    remove: async (userId, id): Promise<DeletedResponse> => {
      if (!(await repository.deleteById(id, userId))) {
        throw notFoundError(ERROR_MESSAGES.brewLogNotFound);
      }

      return { id, deletedAt: new Date().toISOString() };
    },
  };
};
