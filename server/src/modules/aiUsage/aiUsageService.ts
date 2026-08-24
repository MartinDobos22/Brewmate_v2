import {
  AI_DAILY_CALL_LIMIT,
  AI_DAILY_COST_LIMIT,
  AI_MONTHLY_CALL_LIMIT,
  AI_MONTHLY_COST_LIMIT,
  AI_USAGE_WINDOWS,
  type AiUsageLog,
  type AiUsageSummary,
  type AiUsageWindow,
  type ListQuery,
  type ListResponse,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { tooManyRequestsError } from '../../errors/tooManyRequestsError.js';

import { toAiUsageLog } from './aiUsageMapper.js';
import type { AiUsageRepository } from './aiUsageRepository.js';
import { resolveUsageWindows } from './resolveUsageWindows.js';
import { toUsageWindow } from './toUsageWindow.js';

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
   * services call it directly.
   */
  record(input: RecordAiUsageInput): Promise<AiUsageLog>;
  /** The cost dashboard: both windows, their ceilings, and where the month went. */
  summarize(userId: string, now?: Date): Promise<AiUsageSummary>;
  /**
   * Refuses one more model call once an allowance is used up.
   *
   * Called only from the `/ai/*` routes. Everything else in this API keeps
   * working while an account is over its limit - brew mode reads a recipe that
   * is already stored, a bag can still be typed in, the history is still there
   * to read. A limit that took those away would be punishing somebody for
   * having used the app.
   */
  assertWithinLimits(userId: string, now?: Date): Promise<void>;
}

export const createAiUsageService = (repository: AiUsageRepository): AiUsageService => {
  /**
   * Both windows, read together.
   *
   * The dashboard and the limiter are built from the same two rows on purpose:
   * the number somebody is shown and the number that refuses their next scan
   * must be the same number, or the screen becomes a thing people learn to
   * ignore.
   */
  const readWindows = async (
    userId: string,
    now: Date,
  ): Promise<{ readonly day: AiUsageWindow; readonly month: AiUsageWindow }> => {
    const bounds = resolveUsageWindows(now);
    const [dayTotals, monthTotals] = await Promise.all([
      repository.totalsSince({ userId, since: bounds.day.since }),
      repository.totalsSince({ userId, since: bounds.month.since }),
    ]);

    return {
      day: toUsageWindow({
        window: AI_USAGE_WINDOWS.day,
        totals: dayTotals,
        bounds: bounds.day,
        callLimit: AI_DAILY_CALL_LIMIT,
        costLimit: AI_DAILY_COST_LIMIT,
      }),
      month: toUsageWindow({
        window: AI_USAGE_WINDOWS.month,
        totals: monthTotals,
        bounds: bounds.month,
        callLimit: AI_MONTHLY_CALL_LIMIT,
        costLimit: AI_MONTHLY_COST_LIMIT,
      }),
    };
  };

  return {
    list: async (userId, { limit, offset }) =>
      toPage({
        rows: (await repository.list({ userId, limit, offset })).map(toAiUsageLog),
        limit,
        offset,
      }),

    record: async (input) => toAiUsageLog(await repository.record(input)),

    summarize: async (userId, now = new Date()): Promise<AiUsageSummary> => {
      const bounds = resolveUsageWindows(now);
      const [windows, byFunction] = await Promise.all([
        readWindows(userId, now),
        repository.totalsByFunctionSince({ userId, since: bounds.month.since }),
      ]);

      return {
        day: windows.day,
        month: windows.month,
        byFunction: byFunction.map((total) => ({
          functionName: total.functionName,
          calls: total.calls,
          tokensIn: total.tokensIn,
          tokensOut: total.tokensOut,
          costEstimate: total.costEstimate,
        })),
        generatedAt: now.toISOString(),
      };
    },

    /**
     * The month is checked before the day.
     *
     * Somebody who has run out of both should be told about the one that lasts
     * longer, because that is the one that decides what they can do this
     * afternoon - being told the daily allowance returns at midnight would be
     * true and useless.
     */
    assertWithinLimits: async (userId, now = new Date()): Promise<void> => {
      const { day, month } = await readWindows(userId, now);

      if (month.exhaustedBy !== null) {
        throw tooManyRequestsError(ERROR_MESSAGES.aiMonthlyLimitReached, {
          window: month.window,
          limit: month.exhaustedBy,
          resetsAt: month.resetsAt,
        });
      }

      if (day.exhaustedBy !== null) {
        throw tooManyRequestsError(ERROR_MESSAGES.aiDailyLimitReached, {
          window: day.window,
          limit: day.exhaustedBy,
          resetsAt: day.resetsAt,
        });
      }
    },
  };
};
