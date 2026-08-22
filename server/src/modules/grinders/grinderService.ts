import type { CreateGrinderRequest, Grinder, GrinderQuery, ListResponse } from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { badRequestError } from '../../errors/badRequestError.js';
import { conflictError } from '../../errors/conflictError.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';

import { toGrinder } from './grinderMapper.js';
import type { GrinderRepository } from './grinderRepository.js';

export interface GrinderService {
  list(userId: string, query: GrinderQuery): Promise<ListResponse<Grinder>>;
  getById(userId: string, id: string): Promise<Grinder>;
  /** Adds a user's own entry. It stays unverified until somebody checks it. */
  create(userId: string, input: CreateGrinderRequest): Promise<Grinder>;
}

export const createGrinderService = (repository: GrinderRepository): GrinderService => {
  const getById = async (userId: string, id: string): Promise<Grinder> => {
    const row = await repository.findVisible(id, userId);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.grinderNotFound);
    }

    return toGrinder(row);
  };

  return {
    getById,

    list: async (userId, { limit, offset, typicalUse, verifiedOnly }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset, typicalUse, verifiedOnly })).map(
          toGrinder,
        ),
        limit,
        offset,
      }),

    create: async (userId, input): Promise<Grinder> => {
      if (input.minSetting > input.maxSetting) {
        throw badRequestError(ERROR_MESSAGES.grinderRangeInvalid);
      }

      const alreadyCatalogued = await repository.findVerifiedByModel(input.brand, input.model);

      if (alreadyCatalogued !== null) {
        throw conflictError(ERROR_MESSAGES.grinderAlreadyCatalogued);
      }

      return toGrinder(
        await repository.create({
          ...input,
          micronCalibration: input.micronCalibration ?? null,
          createdByUserId: userId,
        }),
      );
    },
  };
};
