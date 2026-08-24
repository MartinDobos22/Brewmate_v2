import {
  TIMELINE_BREWS_PER_VERSION_MAX,
  TIMELINE_MESSAGES_PER_VERSION_MAX,
  hasAnyConstraint,
  type BrewLog,
  type RecipeChatMessage,
  type RecipeTimeline,
  type RecipeTimelineEntry,
  type RecipeTimelineQuery,
} from '@brewmate/shared';

import type { BrewLogRow } from '../../db/schema/brewLogsTable.js';
import type { RecipeChatMessageRow } from '../../db/schema/recipeChatMessagesTable.js';
import type { RecipeRow } from '../../db/schema/recipesTable.js';
import { toBrewLog } from '../brewLogs/brewLogMapper.js';
import type { BrewMethodService } from '../brewMethods/brewMethodService.js';
import type { CoffeeBagRepository } from '../coffeeBags/coffeeBagRepository.js';
import { ERROR_MESSAGES } from '../../errors/errorMessages.js';
import { notFoundError } from '../../errors/notFoundError.js';
import { toRecipeChatMessage } from '../recipeChat/recipeChatMessageMapper.js';
import { toRecipe } from '../recipes/recipeMapper.js';

import { groupByRecipe, toCountByRecipe } from './groupByRecipe.js';
import type { HistoryRepository } from './historyRepository.js';

const NONE = 0;

export interface HistoryServiceDependencies {
  readonly repository: HistoryRepository;
  readonly brewMethodService: BrewMethodService;
  readonly coffeeBagRepository: CoffeeBagRepository;
}

export interface HistoryService {
  /** Every version of one recipe line, with the cups and notes under each. */
  timeline(userId: string, query: RecipeTimelineQuery): Promise<RecipeTimeline>;
}

/**
 * What happened to one coffee on one method.
 *
 * The screen this answers is the one that makes an adjustment worth making:
 * here is what the numbers were, here is what somebody said about the cup,
 * here is what changed because of it, here is what happened next. A flat list
 * of recipes with dates would carry the same rows and none of the argument.
 *
 * A cup brewed with something missing is marked rather than hidden. Those are
 * exactly the cups that came out differently, and a history that quietly
 * ranked a cabin morning next to a measured one would be teaching the reader
 * the wrong lesson about their own equipment.
 */
export const createHistoryService = ({
  repository,
  brewMethodService,
  coffeeBagRepository,
}: HistoryServiceDependencies): HistoryService => {
  /**
   * Both ends of the pair are checked before anything is read.
   *
   * A bag belonging to somebody else answers with the same 404 as a bag that
   * does not exist, so this endpoint is not an oracle for other people's ids -
   * the same rule every other route in this API follows.
   */
  const requirePair = async (
    userId: string,
    { methodId, bagId }: RecipeTimelineQuery,
  ): Promise<void> => {
    await brewMethodService.requireUsable(methodId);

    if (bagId !== undefined && (await coffeeBagRepository.findById(bagId, userId)) === null) {
      throw notFoundError(ERROR_MESSAGES.coffeeBagNotFound);
    }
  };

  const toEntry = (
    row: RecipeRow,
    brews: ReadonlyMap<string, readonly BrewLogRow[]>,
    brewCounts: ReadonlyMap<string, number>,
    messages: ReadonlyMap<string, readonly RecipeChatMessageRow[]>,
    messageCounts: ReadonlyMap<string, number>,
  ): RecipeTimelineEntry => {
    const versionBrews: readonly BrewLog[] = (brews.get(row.id) ?? [])
      .slice(NONE, TIMELINE_BREWS_PER_VERSION_MAX)
      .map(toBrewLog);
    const versionMessages: readonly RecipeChatMessage[] = (messages.get(row.id) ?? [])
      .slice(NONE, TIMELINE_MESSAGES_PER_VERSION_MAX)
      .map(toRecipeChatMessage);

    return {
      recipe: toRecipe(row),
      brews: [...versionBrews],
      brewCount: brewCounts.get(row.id) ?? NONE,
      messages: [...versionMessages],
      messageCount: messageCounts.get(row.id) ?? NONE,
      /**
       * Read from the cups rather than from the recipe's own declared
       * constraints: what a recipe was written around and what was actually
       * missing on the morning somebody brewed it are different facts, and the
       * one that explains a disappointing cup is the second.
       */
      hasConstrainedBrew: versionBrews.some((brew: BrewLog): boolean =>
        hasAnyConstraint(brew.constraints),
      ),
    };
  };

  return {
    timeline: async (userId, query): Promise<RecipeTimeline> => {
      await requirePair(userId, query);

      const bagId = query.bagId ?? null;
      const versions = await repository.listVersions({ userId, methodId: query.methodId, bagId });
      const recipeIds = versions.map((row: RecipeRow): string => row.id);

      const [brewRows, brewCountRows, messageRows, messageCountRows] = await Promise.all([
        repository.listBrews(userId, recipeIds),
        repository.countBrews(userId, recipeIds),
        repository.listMessages(recipeIds),
        repository.countMessages(recipeIds),
      ]);

      const brews = groupByRecipe(brewRows);
      const messages = groupByRecipe(messageRows);
      const brewCounts = toCountByRecipe(brewCountRows);
      const messageCounts = toCountByRecipe(messageCountRows);

      return {
        methodId: query.methodId,
        bagId,
        /** Reversed: read newest-first from the database, printed oldest-first. */
        entries: [...versions]
          .reverse()
          .map((row: RecipeRow): RecipeTimelineEntry =>
            toEntry(row, brews, brewCounts, messages, messageCounts),
          ),
      };
    },
  };
};
