import type {
  TasteProfileDelta,
  TasteProfileSource,
  TasteProfileEventPayload,
} from '@brewmate/shared';

import { clampWeight } from './blendValue.js';
import {
  BREW_SOURCES,
  FULL_CONFIDENCE_EVIDENCE,
  MAX_WEIGHT,
  MIN_WEIGHT,
} from './constants/reducerWeights.js';
import { applyTasteProfileEvent } from './applyTasteProfileEvent.js';
import { neutralProfileState, type TasteProfileState } from './tasteProfileState.js';

const NO_EVIDENCE = 0;
const ONE_BREW = 1;

export interface FoldableEvent {
  readonly id: string;
  readonly source: TasteProfileSource;
  readonly payload: TasteProfileEventPayload;
}

export interface FoldResult {
  readonly state: TasteProfileState;
  /** The delta each event turned out to contribute, keyed by event id. */
  readonly deltas: ReadonlyMap<string, TasteProfileDelta>;
}

/**
 * Rebuilds a taste profile from its audit trail.
 *
 * This is the only way a profile is ever produced - `POST /taste-profile/events`
 * appends and then folds again, rather than patching the stored row. Folding
 * every time costs a handful of rows and buys an invariant worth far more: the
 * profile is always exactly what its events say it should be, so it can never
 * quietly drift away from the evidence behind it.
 */
export const foldTasteProfileEvents = (events: readonly FoldableEvent[]): FoldResult => {
  const deltas = new Map<string, TasteProfileDelta>();
  const sourceEvidence = new Map<TasteProfileSource, number>();

  let state = neutralProfileState();
  let totalEvidence = NO_EVIDENCE;
  let brewCount = NO_EVIDENCE;

  for (const event of events) {
    const applied = applyTasteProfileEvent(state, event.source, event.payload);

    state = applied.state;
    deltas.set(event.id, applied.delta);

    totalEvidence += applied.delta.weight;
    sourceEvidence.set(
      event.source,
      (sourceEvidence.get(event.source) ?? NO_EVIDENCE) + applied.delta.weight,
    );

    if (BREW_SOURCES.includes(event.source)) {
      brewCount += ONE_BREW;
    }
  }

  /** Each source's share of the evidence, which is what `sourceWeights` means. */
  const sourceWeights = Object.fromEntries(
    [...sourceEvidence].map(([source, evidence]: readonly [TasteProfileSource, number]) => [
      source,
      totalEvidence === NO_EVIDENCE ? NO_EVIDENCE : evidence / totalEvidence,
    ]),
  );

  return {
    state: {
      ...state,
      sourceWeights,
      brewCount,
      confidenceLevel: clampWeight(
        totalEvidence / FULL_CONFIDENCE_EVIDENCE,
        MIN_WEIGHT,
        MAX_WEIGHT,
      ),
    },
    deltas,
  };
};
