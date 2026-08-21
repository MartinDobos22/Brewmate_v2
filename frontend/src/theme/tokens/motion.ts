/**
 * Motion is short and purposeful: screen transitions, opening a sheet and
 * changing a step in brew mode. Nothing else animates. Every duration honours
 * the reduce-motion setting through `useReducedMotion`.
 */
export const DURATION = {
  /** Reduce motion collapses every animation to this. */
  instant: 0,
  short: 150,
  medium: 200,
  long: 250,
} as const;

export type DurationToken = keyof typeof DURATION;

/** Material Design 3 easing curves, as cubic-bezier control points. */
export const EASING = {
  standard: { x1: 0.2, y1: 0, x2: 0, y2: 1 },
  decelerate: { x1: 0.05, y1: 0.7, x2: 0.1, y2: 1 },
  accelerate: { x1: 0.3, y1: 0, x2: 0.8, y2: 0.15 },
} as const;

export type EasingToken = keyof typeof EASING;

export interface EasingCurve {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}
