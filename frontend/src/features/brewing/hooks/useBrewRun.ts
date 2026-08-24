import { useEffect, useRef, useState } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { ANALYTICS_EVENT_NAMES, type BrewParams } from '@brewmate/shared';

import { trackEvent } from '../../../lib/analytics';
import { BREW_CUE_LEAD_SECONDS, BREW_RUN_STATES, type BrewRunState } from '../constants/brewMode';
import {
  resolveBrewTimeline,
  resolveStepIndex,
  type BrewTimelineStep,
} from '../services/resolveBrewTimeline';

import { useBrewClock } from './useBrewClock';
import { useStepCue } from './useStepCue';

const FIRST = 0;
const NEXT = 1;
const NO_TIME = 0;

export interface BrewRun {
  readonly state: BrewRunState;
  readonly timeline: readonly BrewTimelineStep[];
  readonly current: BrewTimelineStep | undefined;
  readonly stepNumber: number;
  readonly elapsedSeconds: number;
  /** Seconds left in this step, or null where it ends on a sight. */
  readonly remainingSeconds: number | null;
  readonly isLastStep: boolean;
  readonly start: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly skip: () => void;
  readonly restart: () => void;
  readonly finish: () => void;
}

/**
 * A brew, running.
 *
 * The screen stays awake for as long as this hook is mounted, because the one
 * thing brew mode must not do is go dark while somebody is pouring - and it
 * releases the lock on its own when the screen is left.
 *
 * Which step is current is derived from the clock rather than counted, so a
 * phone that spent two minutes in a pocket comes back to the right step rather
 * than to the step it was on when the timers stopped firing. Skipping moves
 * the clock instead of a separate index, so there is only ever one answer to
 * "where is this brew".
 */
export const useBrewRun = (params: BrewParams): BrewRun => {
  useKeepAwake();

  const clock = useBrewClock();
  const cue = useStepCue();
  const [timeline] = useState<readonly BrewTimelineStep[]>((): readonly BrewTimelineStep[] =>
    resolveBrewTimeline(params),
  );
  const [stepIndex, setStepIndex] = useState(FIRST);
  const [isDone, setIsDone] = useState(false);
  const cuedIndex = useRef(FIRST);
  const warnedIndex = useRef(-NEXT);

  const current = timeline[stepIndex];
  const endsAt = current?.endsAtSecond ?? null;
  const remainingSeconds =
    endsAt === null ? null : Math.max(endsAt - clock.elapsedSeconds, NO_TIME);
  const isLastStep = stepIndex >= timeline.length - NEXT;

  /**
   * Catching up on the clock, and telling the person about it.
   *
   * The advance and the cue live together because a cue is only honest if it
   * is announcing something that just happened. Several steps may pass at once
   * after the app comes back from the background; that gets one announcement,
   * not four buzzes in a row for steps somebody already missed.
   */
  useEffect((): void => {
    if (!clock.isRunning || isDone) {
      return;
    }

    const target = resolveStepIndex(timeline, clock.elapsedSeconds, stepIndex);

    if (target !== stepIndex) {
      setStepIndex(target);
    }

    if (target !== cuedIndex.current) {
      cuedIndex.current = target;
      cue.announce();

      return;
    }

    if (
      remainingSeconds !== null &&
      remainingSeconds <= BREW_CUE_LEAD_SECONDS &&
      warnedIndex.current !== target
    ) {
      warnedIndex.current = target;
      cue.warn();
    }
  }, [clock.elapsedSeconds, clock.isRunning, isDone, stepIndex, timeline, remainingSeconds, cue]);

  const resolveState = (): BrewRunState => {
    if (isDone) {
      return BREW_RUN_STATES.done;
    }

    if (!clock.hasStarted) {
      return BREW_RUN_STATES.ready;
    }

    return clock.isRunning ? BREW_RUN_STATES.running : BREW_RUN_STATES.paused;
  };

  const finish = (): void => {
    setIsDone(true);
    clock.pause();
    cue.finish();
  };

  return {
    timeline,
    current,
    remainingSeconds,
    isLastStep,
    state: resolveState(),
    stepNumber: stepIndex + NEXT,
    elapsedSeconds: clock.elapsedSeconds,
    finish,

    /**
     * The one moment in this flow worth counting.
     *
     * Somebody who reached the recipe and never pressed start is a different
     * person from somebody who brewed it, and the gap between the two is the
     * only thing a funnel over brewing can usefully say.
     */
    start: (): void => {
      trackEvent(ANALYTICS_EVENT_NAMES.brewStarted);
      clock.start();
    },

    pause: clock.pause,
    resume: clock.resume,

    /**
     * Moving on before the clock says so.
     *
     * Where the next step has a stated start, the clock jumps to it, so the
     * rest of the schedule stays true to the recipe rather than running two
     * seconds early for the remainder of the brew.
     */
    skip: (): void => {
      if (isLastStep) {
        finish();

        return;
      }

      const next = timeline[stepIndex + NEXT];

      setStepIndex(stepIndex + NEXT);
      cuedIndex.current = stepIndex + NEXT;

      const nextStart = next?.startsAtSecond ?? null;

      if (nextStart !== null) {
        clock.jumpTo(nextStart);
      }
    },

    restart: (): void => {
      setStepIndex(FIRST);
      setIsDone(false);
      cuedIndex.current = FIRST;
      warnedIndex.current = -NEXT;
      clock.start();
    },
  };
};
