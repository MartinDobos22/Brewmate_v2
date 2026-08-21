import type {
  BagEvaluation,
  CreateBagEvaluationRequest,
  ListQuery,
  ListResponse,
  UpdateBagEvaluationRequest,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import type { CoffeeBagRepository } from '../coffeeBags/coffeeBagRepository.js';
import type { TasteProfileService } from '../tasteProfiles/tasteProfileService.js';

import { toBagEvaluation } from './bagEvaluationMapper.js';
import type { BagEvaluationRepository } from './bagEvaluationRepository.js';

export interface BagEvaluationService {
  list(userId: string, query: ListQuery): Promise<ListResponse<BagEvaluation>>;
  getById(userId: string, id: string): Promise<BagEvaluation>;
  create(userId: string, input: CreateBagEvaluationRequest): Promise<BagEvaluation>;
  update(userId: string, id: string, changes: UpdateBagEvaluationRequest): Promise<BagEvaluation>;
}

export const createBagEvaluationService = (
  repository: BagEvaluationRepository,
  coffeeBagRepository: CoffeeBagRepository,
  tasteProfileService: TasteProfileService,
): BagEvaluationService => {
  const requireOwned = async (userId: string, id: string): Promise<BagEvaluation> => {
    const row = await repository.findById(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.bagEvaluationNotFound);
    }

    return toBagEvaluation(row);
  };

  const requireOwnedBag = async (userId: string, bagId: string): Promise<void> => {
    if ((await coffeeBagRepository.findById(bagId, userId)) === null) {
      throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
    }
  };

  return {
    getById: requireOwned,

    list: async (userId, { limit, offset }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset })).map(toBagEvaluation),
        limit,
        offset,
      }),

    /**
     * The profile's confidence is stamped on here, at the moment the advice is
     * recorded. Reading it back from the live profile later would rewrite how
     * much that advice was ever worth.
     */
    create: async (userId, input): Promise<BagEvaluation> => {
      if (input.linkedBagId !== undefined && input.linkedBagId !== null) {
        await requireOwnedBag(userId, input.linkedBagId);
      }

      const profile = await tasteProfileService.get(userId);

      return toBagEvaluation(
        await repository.create({
          ...input,
          userId,
          profileConfidenceAtTime: profile.confidenceLevel,
        }),
      );
    },

    /** Only the outcome is editable; the verdict is a record, not a draft. */
    update: async (userId, id, changes): Promise<BagEvaluation> => {
      if (changes.linkedBagId !== undefined && changes.linkedBagId !== null) {
        await requireOwnedBag(userId, changes.linkedBagId);
      }

      const row = await repository.updateById(id, userId, changes);

      if (row === null) {
        throw notFoundError(ERROR_MESSAGES.bagEvaluationNotFound);
      }

      return toBagEvaluation(row);
    },
  };
};
