import type { BrewMethod, BrewMethodQuery, ListResponse } from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';

import { toBrewMethod } from './brewMethodMapper.js';
import type { BrewMethodRepository } from './brewMethodRepository.js';

export interface BrewMethodService {
  list(query: BrewMethodQuery): Promise<ListResponse<BrewMethod>>;
  /**
   * The method a recipe may be written for.
   *
   * A retired method is not an option for something new, even though the
   * recipes already pointing at it keep working.
   */
  requireUsable(id: string): Promise<BrewMethod>;
}

export const createBrewMethodService = (repository: BrewMethodRepository): BrewMethodService => ({
  list: async ({ limit, offset, category, includeInactive }) =>
    toPage({
      rows: (await repository.list({ limit, offset, category, includeInactive })).map(toBrewMethod),
      limit,
      offset,
    }),

  requireUsable: async (id): Promise<BrewMethod> => {
    const row = await repository.findById(id);

    if (row === null) {
      throw notFoundError(ERROR_MESSAGES.brewMethodNotFound);
    }

    if (!row.isActive) {
      throw notFoundError(ERROR_MESSAGES.brewMethodInactive);
    }

    return toBrewMethod(row);
  },
});
