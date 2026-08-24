import type { BrewLog } from '../brewLogs/brewLogSchema.js';
import { resolveRatio } from '../brewing/ratioCalculator.js';

import {
  DIAL_IN_CHANGES,
  DIAL_IN_DIRECTIONS,
  type DialInChange,
  type DialInDirection,
} from './dialInChanges.js';
import { DIAL_IN_TARGET_SECONDS_MAX, DIAL_IN_TARGET_SECONDS_MIN } from './espressoFieldLimits.js';

const FIRST = 0;
const NEXT = 1;
const NOTHING = 0;
const NO_DISTANCE = 0;

/** Unreachable: the entry is mapped straight off the array it indexes into. */
const SHOT_TIMELINE_ERROR = 'A shot timeline entry lost its own shot.';

/** Whether the run is getting closer to the window it is aiming at. */
export const SHOT_TRENDS = {
  closer: 'closer',
  further: 'further',
  steady: 'steady',
} as const;

export type ShotTrend = (typeof SHOT_TRENDS)[keyof typeof SHOT_TRENDS];

/** One shot in the run, and what was different about it from the one before. */
export interface ShotTimelineEntry {
  readonly brewLogId: string;
  readonly shotNumber: number;
  readonly doseGrams: number | null;
  readonly yieldGrams: number | null;
  readonly timeSeconds: number | null;
  readonly ratio: number | null;
  readonly grindSetting: number | null;
  /** What moved since the previous shot, and which way. */
  readonly change: DialInChange;
  readonly direction: DialInDirection | null;
  /** Whether this shot came closer to the target window than the one before it. */
  readonly trend: ShotTrend;
}

/**
 * How far a shot time is from the window being aimed at.
 *
 * Zero inside the window, and the distance to the nearer edge outside it. A
 * single number rather than two comparisons, because the timeline only ever
 * asks one question of it: is this shot closer than the last one.
 */
const distanceFromTarget = (timeSeconds: number | null): number | null => {
  if (timeSeconds === null) {
    return null;
  }

  if (timeSeconds < DIAL_IN_TARGET_SECONDS_MIN) {
    return DIAL_IN_TARGET_SECONDS_MIN - timeSeconds;
  }

  return timeSeconds > DIAL_IN_TARGET_SECONDS_MAX
    ? timeSeconds - DIAL_IN_TARGET_SECONDS_MAX
    : NO_DISTANCE;
};

const trendBetween = (previous: number | null, current: number | null): ShotTrend => {
  if (previous === null || current === null || previous === current) {
    return SHOT_TRENDS.steady;
  }

  return current < previous ? SHOT_TRENDS.closer : SHOT_TRENDS.further;
};

const changeBetween = (
  previous: ShotFacts,
  current: ShotFacts,
): { readonly change: DialInChange; readonly direction: DialInDirection | null } => {
  if (
    previous.grindSetting !== null &&
    current.grindSetting !== null &&
    previous.grindSetting !== current.grindSetting
  ) {
    return {
      change: DIAL_IN_CHANGES.grind,
      direction:
        current.grindSetting < previous.grindSetting
          ? DIAL_IN_DIRECTIONS.finer
          : DIAL_IN_DIRECTIONS.coarser,
    };
  }

  if (
    previous.doseGrams !== null &&
    current.doseGrams !== null &&
    previous.doseGrams !== current.doseGrams
  ) {
    return {
      change: DIAL_IN_CHANGES.dose,
      direction:
        current.doseGrams > previous.doseGrams ? DIAL_IN_DIRECTIONS.more : DIAL_IN_DIRECTIONS.less,
    };
  }

  return { change: DIAL_IN_CHANGES.none, direction: null };
};

/** What a shot was, once the log and the recipe behind it have been read together. */
interface ShotFacts {
  readonly doseGrams: number | null;
  readonly yieldGrams: number | null;
  readonly timeSeconds: number | null;
  readonly grindSetting: number | null;
}

/**
 * What one brew log says about the shot it recorded.
 *
 * Read off `actualParams` first and the recipe's own numbers second, because
 * the two answer different questions: the recipe is what was aimed at and the
 * log is what happened, and a dial-in is only ever reasoning about the second.
 */
const readShot = (log: BrewLog, grindSetting: number | null): ShotFacts => ({
  doseGrams: log.actualParams.doseGrams ?? null,
  yieldGrams: log.actualParams.waterGrams ?? null,
  timeSeconds: log.actualParams.totalTimeSeconds ?? log.durationSeconds,
  grindSetting: log.actualParams.grindSetting ?? grindSetting,
});

export interface ShotSource {
  readonly log: BrewLog;
  /** The grind the recipe this shot was pulled from asked for. */
  readonly grindSetting: number | null;
}

/**
 * The run of shots, oldest first, with what changed between each pair.
 *
 * Derived rather than stored, and derived here rather than on a screen,
 * because it is arithmetic over history and history is the one thing a dial-in
 * cannot be allowed to disagree with itself about. The screen draws it, and
 * the model is told the same thing in the same order - if those two ever
 * differed, somebody would be arguing with a chart the app is not looking at.
 */
export const resolveShotTimeline = (shots: readonly ShotSource[]): readonly ShotTimelineEntry[] => {
  const facts = shots.map((shot: ShotSource): ShotFacts => readShot(shot.log, shot.grindSetting));

  return shots.map((shot: ShotSource, index: number): ShotTimelineEntry => {
    const current = facts[index];
    const previous = index === FIRST ? undefined : facts[index - NEXT];

    if (current === undefined) {
      throw new Error(SHOT_TIMELINE_ERROR);
    }

    const movement =
      previous === undefined
        ? { change: DIAL_IN_CHANGES.none, direction: null }
        : changeBetween(previous, current);

    return {
      brewLogId: shot.log.id,
      shotNumber: index + NEXT,
      doseGrams: current.doseGrams,
      yieldGrams: current.yieldGrams,
      timeSeconds: current.timeSeconds,
      ratio:
        current.doseGrams === null || current.yieldGrams === null || current.doseGrams === NOTHING
          ? null
          : resolveRatio(current.doseGrams, current.yieldGrams),
      grindSetting: current.grindSetting,
      change: movement.change,
      direction: movement.direction,
      trend:
        previous === undefined
          ? SHOT_TRENDS.steady
          : trendBetween(
              distanceFromTarget(previous.timeSeconds),
              distanceFromTarget(current.timeSeconds),
            ),
    };
  });
};
