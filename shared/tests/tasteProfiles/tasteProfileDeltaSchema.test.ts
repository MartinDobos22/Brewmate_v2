import { describe, expect, it } from 'vitest';

import { TASTE_AXIS_MAX, TASTE_AXIS_MIN, tasteProfileDeltaSchema } from '../../src/index.js';

const NOTHING = 0;
const FULL_WEIGHT = 1;
/** Somebody who said plainly that they want less of something. */
const MOVED_DOWN = -3;
const DISLIKED_MORE = -0.4;

describe('what the reducer did with one event', () => {
  /**
   * The rule this file exists for.
   *
   * A delta is a difference rather than a position, and half of everything
   * anybody says about coffee asks for less of something. Validated against
   * the bounds of a value, every one of those observations came back as a
   * failed response - after the event had already been stored, so the profile
   * had moved and the app was told it had not.
   */
  it('accepts an axis that moved down', () => {
    const parsed = tasteProfileDeltaSchema.safeParse({
      axes: { acidity: MOVED_DOWN },
      flavorAffinities: {},
      weight: FULL_WEIGHT,
    });

    expect(parsed.success).toBe(true);
  });

  it('accepts a flavour tag the profile now likes less', () => {
    const parsed = tasteProfileDeltaSchema.safeParse({
      axes: {},
      flavorAffinities: { chocolate: DISLIKED_MORE },
      weight: FULL_WEIGHT,
    });

    expect(parsed.success).toBe(true);
  });

  /** The widest a move can be is the whole scale, and no wider. */
  it('refuses a move wider than the scale it is measured on', () => {
    const parsed = tasteProfileDeltaSchema.safeParse({
      axes: { body: TASTE_AXIS_MIN - TASTE_AXIS_MAX - FULL_WEIGHT },
      flavorAffinities: {},
      weight: NOTHING,
    });

    expect(parsed.success).toBe(false);
  });
});
