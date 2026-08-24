import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { MILLISECONDS_PER_SECOND } from '../../../constants/time';
import { BREW_TICK_MS } from '../constants/brewMode';

const NO_TIME = 0;
const ACTIVE: AppStateStatus = 'active';

export interface BrewClock {
  readonly elapsedSeconds: number;
  readonly isRunning: boolean;
  readonly hasStarted: boolean;
  readonly start: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly reset: () => void;
  /** Moves the origin so that the brew is now at this many seconds. */
  readonly jumpTo: (seconds: number) => void;
}

/**
 * The clock brew mode runs on, and the one thing about this screen that had to
 * be got right.
 *
 * The elapsed time is always computed from the timestamp the brew started at,
 * never accumulated by a ticking interval. iOS suspends JavaScript timers the
 * moment the app goes to the background or the display sleeps - which is
 * exactly what happens when somebody puts the phone down to pour - and a
 * counter that added a second per tick would come back from that having lost
 * however long the pour took. Here the interval only asks for a redraw: if it
 * never fires, the next one still reports the true time.
 *
 * The app state listener is the same idea for the other direction. Returning
 * to the foreground redraws immediately rather than waiting up to a tick,
 * because the first thing somebody does after picking the phone back up is
 * read the number.
 */
export const useBrewClock = (): BrewClock => {
  const startedAt = useRef<number | null>(null);
  const pausedAt = useRef<number | null>(null);
  const pausedTotalMs = useRef(NO_TIME);
  const [, setFrame] = useState(NO_TIME);

  const redraw = (): void => {
    setFrame(Date.now());
  };

  useEffect((): (() => void) => {
    const interval = setInterval(redraw, BREW_TICK_MS);
    const subscription = AppState.addEventListener('change', (state: AppStateStatus): void => {
      if (state === ACTIVE) {
        redraw();
      }
    });

    return (): void => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const origin = startedAt.current;
  const elapsedMs =
    origin === null ? NO_TIME : (pausedAt.current ?? Date.now()) - origin - pausedTotalMs.current;

  return {
    elapsedSeconds: Math.max(elapsedMs, NO_TIME) / MILLISECONDS_PER_SECOND,
    isRunning: origin !== null && pausedAt.current === null,
    hasStarted: origin !== null,

    start: (): void => {
      startedAt.current = Date.now();
      pausedAt.current = null;
      pausedTotalMs.current = NO_TIME;
      redraw();
    },

    pause: (): void => {
      if (pausedAt.current === null) {
        pausedAt.current = Date.now();
        redraw();
      }
    },

    resume: (): void => {
      if (pausedAt.current !== null) {
        pausedTotalMs.current += Date.now() - pausedAt.current;
        pausedAt.current = null;
        redraw();
      }
    },

    reset: (): void => {
      startedAt.current = null;
      pausedAt.current = null;
      pausedTotalMs.current = NO_TIME;
      redraw();
    },

    /**
     * Skipping a step moves the clock, not a counter beside it.
     *
     * There is one source of truth for where the brew is, and it is the
     * origin timestamp. Jumping the origin keeps every derived thing - which
     * step is current, how long is left, the total elapsed - consistent
     * without any of them needing to know a skip happened.
     */
    jumpTo: (seconds: number): void => {
      if (startedAt.current === null) {
        return;
      }

      startedAt.current = Date.now() - seconds * MILLISECONDS_PER_SECOND;
      pausedTotalMs.current = NO_TIME;

      if (pausedAt.current !== null) {
        pausedAt.current = Date.now();
      }

      redraw();
    },
  };
};
