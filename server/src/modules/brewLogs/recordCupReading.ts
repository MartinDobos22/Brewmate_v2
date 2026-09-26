import {
  mergeCupReading,
  saysSomethingAboutCup,
  type BrewLog,
  type CupReading,
} from '@brewmate/shared';

import { toBrewLog } from './brewLogMapper.js';
import type { BrewLogRepository } from './brewLogRepository.js';

const FIRST_PAGE = 0;
const LATEST_ONLY = 1;

export interface CupReadingRequest {
  readonly brewLogRepository: BrewLogRepository;
  readonly userId: string;
  readonly recipeId: string;
  /** The cup the conversation named, where it named one. */
  readonly log: BrewLog | null;
  readonly reading: CupReading | null | undefined;
}

/**
 * Writes what somebody said about a cup onto the cup.
 *
 * The cup the conversation is about where it named one, and otherwise the
 * latest cup of the same recipe - somebody who opens the chat from a recipe an
 * hour after brewing it and says "bola kyslá" is talking about the cup they
 * made, and it is the last one on that recipe. A recipe nobody has brewed has
 * no cup to write it on, and the remark stays in the conversation only.
 *
 * Merged rather than replaced, field by field, so a second message about the
 * same cup adds to the first instead of wiping out whatever it did not repeat.
 *
 * @returns the cup as it now stands, or null where nothing was written.
 */
export const recordCupReading = async ({
  brewLogRepository,
  userId,
  recipeId,
  log,
  reading,
}: CupReadingRequest): Promise<BrewLog | null> => {
  if (!saysSomethingAboutCup(reading)) {
    return null;
  }

  const target =
    log ??
    (
      await brewLogRepository.list({ userId, recipeId, limit: LATEST_ONLY, offset: FIRST_PAGE })
    ).map(toBrewLog)[FIRST_PAGE] ??
    null;

  if (target === null) {
    return null;
  }

  const updated = await brewLogRepository.updateById(target.id, userId, {
    cupReading: mergeCupReading(target.cupReading, reading),
  });

  return updated === null ? null : toBrewLog(updated);
};
