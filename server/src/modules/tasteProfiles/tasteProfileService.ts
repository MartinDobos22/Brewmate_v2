import type {
  CreateTasteProfileEventRequest,
  ListQuery,
  ListResponse,
  TasteProfile,
  TasteProfileEvent,
} from '@brewmate/shared';

import { toPage } from '../../db/rows/toPage.js';
import type { TasteProfileEventRow } from '../../db/schema/tasteProfileEventsTable.js';

import { foldTasteProfileEvents, type FoldableEvent } from './foldTasteProfileEvents.js';
import { toTasteProfile, toTasteProfileEvent } from './tasteProfileMapper.js';
import type { TasteProfileEventRepository } from './tasteProfileEventRepository.js';
import type { TasteProfileRepository } from './tasteProfileRepository.js';

export interface TasteProfileService {
  get(userId: string): Promise<TasteProfile>;
  listEvents(userId: string, query: ListQuery): Promise<ListResponse<TasteProfileEvent>>;
  /** Appends an observation and folds the trail again. */
  addEvent(userId: string, input: CreateTasteProfileEventRequest): Promise<TasteProfileEvent>;
  /** Rebuilds the profile from its events, from scratch. */
  recompute(userId: string): Promise<TasteProfile>;
}

const toFoldable = (row: TasteProfileEventRow): FoldableEvent => ({
  id: row.id,
  source: row.source,
  payload: row.payload,
});

export const createTasteProfileService = (
  repository: TasteProfileRepository,
  eventRepository: TasteProfileEventRepository,
): TasteProfileService => {
  /**
   * The one path that ever writes a profile.
   *
   * Replaying the whole trail on every change is deliberately more work than
   * patching the stored row would be. It buys the invariant the audit table
   * exists for: the profile is always exactly the fold of its events, so
   * running this twice changes nothing the second time.
   */
  const recompute = async (userId: string): Promise<TasteProfile> => {
    const events = await eventRepository.listForReplay(userId);
    const { state, deltas } = foldTasteProfileEvents(events.map(toFoldable));

    await eventRepository.saveAppliedDeltas(deltas);

    return toTasteProfile(await repository.save(userId, state));
  };

  return {
    recompute,

    /** A profile nobody has taught anything yet is the neutral one, not an error. */
    get: async (userId): Promise<TasteProfile> => {
      const row = await repository.findByUserId(userId);

      return row === null ? recompute(userId) : toTasteProfile(row);
    },

    listEvents: async (userId, { limit, offset }) =>
      toPage({
        rows: (await eventRepository.list({ userId, limit, offset })).map(toTasteProfileEvent),
        limit,
        offset,
      }),

    /**
     * Re-sending an observation is safe.
     *
     * When the caller names what produced the event, an event that already
     * carries that reference is returned untouched rather than appended again -
     * a questionnaire submitted twice on a flaky connection must not count
     * twice. The partial unique index enforces the same rule underneath.
     */
    addEvent: async (userId, { source, sourceRef, payload }): Promise<TasteProfileEvent> => {
      const reference = sourceRef ?? null;

      if (reference !== null) {
        const existing = await eventRepository.findBySourceRef(userId, source, reference);

        if (existing !== null) {
          return toTasteProfileEvent(existing);
        }
      }

      const created = await eventRepository.create({
        userId,
        source,
        sourceRef: reference,
        payload,
      });

      await recompute(userId);

      /** Re-read so the caller sees the delta the fold has just written. */
      const applied = await eventRepository.findById(created.id, userId);

      return toTasteProfileEvent(applied ?? created);
    },
  };
};
