import type { AiUsageLog, ListQuery, ListResponse } from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';

import { toAiUsageLog } from './aiUsageMapper.js';
import type { AiUsageRepository } from './aiUsageRepository.js';

export interface RecordAiUsageInput {
  readonly userId: string;
  readonly functionName: string;
  readonly model: string;
  readonly tokensIn: number;
  readonly tokensOut: number;
  /** A decimal string, so a month of these can be summed exactly. */
  readonly costEstimate: string;
}

export interface AiUsageService {
  list(userId: string, query: ListQuery): Promise<ListResponse<AiUsageLog>>;
  /**
   * Records a model call.
   *
   * There is no route behind this on purpose: a client that could declare its
   * own token usage would be reporting a number nobody can trust. The AI
   * services call it directly once they exist.
   */
  record(input: RecordAiUsageInput): Promise<AiUsageLog>;
}

export const createAiUsageService = (repository: AiUsageRepository): AiUsageService => ({
  list: async (userId, { limit, offset }) =>
    toPage({
      rows: (await repository.list({ userId, limit, offset })).map(toAiUsageLog),
      limit,
      offset,
    }),

  record: async (input) => toAiUsageLog(await repository.record(input)),
});
