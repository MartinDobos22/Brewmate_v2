import {
  type TasteAxisConfidence,
  type TasteProfileDelta,
  type TasteProfileSource,
  type TasteProfileEventPayload,
} from '@brewmate/shared';

import { clampWeight } from './blendValue.js';
import {
  BREW_SOURCES,
  FULL_AXIS_EVIDENCE,
  FULL_CONFIDENCE_EVIDENCE,
  MAX_WEIGHT,
  MIN_WEIGHT,
  NO_EVIDENCE,
} from './constants/reducerWeights.js';
import { applyTasteProfileEvent } from './applyTasteProfileEvent.js';
import {
  neutralProfileState,
  noAxisEvidence,
  type AxisEvidence,
  type TasteProfileState,
} from './tasteProfileState.js';

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

const share = (evidence: number, total: number): number =>
  total === NO_EVIDENCE ? NO_EVIDENCE : evidence / total;

/** Raw per-axis evidence, divided down into the 0..1 figure the profile carries. */
const toAxisConfidence = (evidence: AxisEvidence): TasteAxisConfidence => ({
  acidity: clampWeight(evidence.acidity / FULL_AXIS_EVIDENCE, MIN_WEIGHT, MAX_WEIGHT),
  sweetness: clampWeight(evidence.sweetness / FULL_AXIS_EVIDENCE, MIN_WEIGHT, MAX_WEIGHT),
  body: clampWeight(evidence.body / FULL_AXIS_EVIDENCE, MIN_WEIGHT, MAX_WEIGHT),
  bitterness: clampWeight(evidence.bitterness / FULL_AXIS_EVIDENCE, MIN_WEIGHT, MAX_WEIGHT),
  intensity: clampWeight(evidence.intensity / FULL_AXIS_EVIDENCE, MIN_WEIGHT, MAX_WEIGHT),
});

/**
 * Rebuilds a taste profile from its audit trail.
 *
 * This is the only way a profile is ever produced - `POST /taste-profile/events`
 * appends and then folds again, rather than patching the stored row. Folding
 * every time costs a handful of rows and buys an invariant worth far more: the
 * profile is always exactly what its events say it should be, so it can never
 * quietly drift away from the evidence behind it.
 *
 * Two things are counted rather than one. The axes are a running belief, where
 * the latest word moves the value; the evidence beside them only ever
 * accumulates, and is what the app is allowed to say the belief is worth.
 * Keeping them apart is what lets the profile hold a firm value it openly
 * admits it has barely earned - which is the honest description of almost
 * every account that has answered a questionnaire and nothing else.
 */
export const foldTasteProfileEvents = (events: readonly FoldableEvent[]): FoldResult => {
  const deltas = new Map<string, TasteProfileDelta>();
  const sourceEvidence = new Map<TasteProfileSource, number>();

  let state = neutralProfileState();
  let axisEvidence = noAxisEvidence();
  let totalEvidence = NO_EVIDENCE;
  let brewCount = NO_EVIDENCE;

  for (const event of events) {
    const applied = applyTasteProfileEvent(state, axisEvidence, event.source, event.payload);

    state = applied.state;
    axisEvidence = applied.axisEvidence;
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
      share(evidence, totalEvidence),
    ]),
  );

  return {
    state: {
      ...state,
      sourceWeights,
      axisConfidence: toAxisConfidence(axisEvidence),
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
