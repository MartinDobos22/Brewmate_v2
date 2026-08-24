/** Where a brew run is: not started, running, held, or finished. */
export const BREW_RUN_STATES = {
  ready: 'ready',
  running: 'running',
  paused: 'paused',
  done: 'done',
} as const;

export type BrewRunState = (typeof BREW_RUN_STATES)[keyof typeof BREW_RUN_STATES];

/**
 * How often the countdown redraws.
 *
 * Four times a second rather than once, so the number never appears to skip a
 * value - and it is only a redraw. The time itself is always computed from the
 * timestamp the brew started at, so a tick that never fires because iOS
 * suspended the timer costs a frame, not a second.
 */
export const BREW_TICK_MS = 250;

/**
 * How long before a step ends the phone buzzes.
 *
 * Two seconds, because a pour has to start slightly before the number reaches
 * zero if the water is to be in the cone at the right moment - and because a
 * cue that arrives exactly on time arrives late for anybody whose hands are
 * already busy.
 */
export const BREW_CUE_LEAD_SECONDS = 2;
