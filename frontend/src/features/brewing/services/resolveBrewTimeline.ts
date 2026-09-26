import type { BrewParams, BrewStep } from '@brewmate/shared';

const NOTHING = 0;
const FIRST = 0;
const NEXT = 1;
const PREVIOUS = 1;
const START = 0;
const COMPLETE = 1;

export interface BrewTimelineStep {
  readonly step: BrewStep;
  /** When this step begins, or null where it begins when the last one is done. */
  readonly startsAtSecond: number | null;
  /** When it ends, or null where it ends on a sight rather than a clock. */
  readonly endsAtSecond: number | null;
}

/**
 * The recipe's steps, turned into something a countdown can run.
 *
 * Two things are worked out here that the recipe does not state directly. A
 * step's end, because a recipe usually says when steps *start* and brew mode
 * counts one of them down at a time - the last step has no successor to
 * subtract from, so the total time finishes it. And a step's start where the
 * recipe left it open, which is the shape a brew declared without a clock
 * takes: those steps end when somebody says so, not when a number reaches
 * zero.
 *
 * A null end is therefore not missing data. It is the instruction "wait until
 * you see it", and the screen shows a button instead of a countdown.
 */
export const resolveBrewTimeline = (params: BrewParams): readonly BrewTimelineStep[] => {
  const ordered = [...params.steps].sort((left: BrewStep, right: BrewStep): number =>
    left.order === right.order ? NOTHING : left.order - right.order,
  );

  return ordered.map((step: BrewStep, index: number): BrewTimelineStep => {
    const next = ordered[index + NEXT];
    const duration = step.durationSeconds ?? null;
    const explicitEnd =
      step.atSecond !== null && duration !== null ? step.atSecond + duration : null;
    const impliedEnd =
      next === undefined ? (params.totalTimeSeconds ?? null) : (next.atSecond ?? null);

    return {
      step,
      startsAtSecond: step.atSecond,
      endsAtSecond: explicitEnd ?? impliedEnd,
    };
  });
};

/**
 * Which step a given moment falls in, counting from where the run already is.
 *
 * Written to catch up rather than to advance one step at a time, because that
 * is what a phone returning from somebody's pocket needs: the clock is derived
 * from a timestamp, so half a brew may have passed since the last redraw, and
 * stepping forward once per tick would crawl through it a quarter of a second
 * behind reality.
 *
 * It stops dead at a step with no end. Those steps are waiting for a person,
 * and no amount of elapsed time is an answer to that.
 */
export const resolveStepIndex = (
  timeline: readonly BrewTimelineStep[],
  elapsedSeconds: number,
  from: number,
): number => {
  let index = Math.max(from, FIRST);

  while (index < timeline.length - NEXT) {
    const end = timeline[index]?.endsAtSecond ?? null;

    if (end === null || elapsedSeconds < end) {
      return index;
    }

    index += NEXT;
  }

  return index;
};

/** Whether this recipe has a pour schedule at all, or is just a stopwatch. */
export const hasPourSchedule = (params: BrewParams): boolean => params.steps.length > NOTHING;

/**
 * How long is left of a stopwatch brew's target time.
 *
 * Null once the target has passed, which turns the display into a plain
 * elapsed count: a French press that has stood a minute longer than planned
 * has not failed, and a screen showing a negative number would say it had.
 */
export const resolveTargetRemaining = (
  params: BrewParams,
  elapsedSeconds: number,
): number | null => {
  const target = params.totalTimeSeconds ?? null;

  return target === null || elapsedSeconds >= target ? null : target - elapsedSeconds;
};

/**
 * When a step actually begins, which is not always what the recipe says.
 *
 * A recipe may leave a start open - that is the shape a brew declared without
 * a clock takes - and in that case the step begins when the one before it
 * ended. The first step of all begins at the first drop of water.
 */
const resolveStepStart = (timeline: readonly BrewTimelineStep[], index: number): number => {
  const declared = timeline[index]?.startsAtSecond ?? null;

  if (declared !== null) {
    return declared;
  }

  return timeline[index - PREVIOUS]?.endsAtSecond ?? START;
};

/**
 * How far through the current step the brew is, as a share between nought and
 * one - or null where the step ends on a sight rather than on a clock.
 *
 * This is what the pour ring is drawn from, which is the whole reason it is a
 * function over the timeline rather than a counter the ring keeps: a phone
 * that spent the bloom in somebody's pocket comes back and the arc is where
 * the brew is, not where the last frame left it.
 *
 * A null is not missing data and must not be drawn as nought. There is no arc
 * for a step that is waiting for a person, because an arc at nought says the
 * step has not started and one creeping forward says it is being timed, and
 * neither is true.
 */
export const resolveStepProgress = (
  timeline: readonly BrewTimelineStep[],
  index: number,
  elapsedSeconds: number,
): number | null => {
  const end = timeline[index]?.endsAtSecond ?? null;

  if (end === null) {
    return null;
  }

  const start = resolveStepStart(timeline, index);
  const duration = end - start;

  if (duration <= NOTHING) {
    return null;
  }

  return Math.min(Math.max((elapsedSeconds - start) / duration, START), COMPLETE);
};

/**
 * The same, for a brew that is a stopwatch against a target rather than a
 * schedule. Null where the recipe named no target, because there is then
 * nothing for a ring to be a share of.
 */
export const resolveTargetProgress = (
  params: BrewParams,
  elapsedSeconds: number,
): number | null => {
  const target = params.totalTimeSeconds ?? null;

  if (target === null || target <= NOTHING) {
    return null;
  }

  return Math.min(elapsedSeconds / target, COMPLETE);
};
