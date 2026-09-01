import { describe, expect, it } from 'vitest';

import {
  TASTE_AXIS_MAX,
  TASTE_AXIS_MIN,
  foldAxisObservations,
  type AxisObservation,
} from '../../src/index.js';

/** The scale the questionnaire's answers are stated on. */
const MAX_DISAGREEMENT = 3;
const FULL_WEIGHT = 1;
const INDIRECT_WEIGHT = 0.7;
const DISLIKES_SOUR = 2.5;
const WANTS_BRIGHT = 8.5;
const MIDDLE = 5.5;
const NOTHING = 0;
const PERFECT = 1;

describe('folding what a questionnaire said about one axis', () => {
  it('says nothing about an axis nobody answered for', () => {
    expect(foldAxisObservations([], MAX_DISAGREEMENT)).toBeNull();
  });

  /** One answer cannot disagree with itself, whatever it said. */
  it('treats a single answer as fully agreed with', () => {
    const folded = foldAxisObservations(
      [{ value: DISLIKES_SOUR, weight: FULL_WEIGHT }],
      MAX_DISAGREEMENT,
    );

    expect(folded?.value).toBe(DISLIKES_SOUR);
    expect(folded?.agreement).toBe(PERFECT);
    expect(folded?.coverage).toBe(FULL_WEIGHT);
  });

  it('weighs a trusted question above a less trusted one', () => {
    const folded = foldAxisObservations(
      [
        { value: DISLIKES_SOUR, weight: FULL_WEIGHT },
        { value: WANTS_BRIGHT, weight: INDIRECT_WEIGHT },
      ],
      MAX_DISAGREEMENT,
    );

    expect(folded?.value).toBeLessThan(MIDDLE);
  });

  /**
   * The whole reason this function exists.
   *
   * Somebody who says they cannot stand a sour cup and, four questions later,
   * that what they want is a bright fruity coffee has said two honest things
   * that describe different drinks. The mean of the two is the one reading
   * neither answer supports, so it is still recorded - it is the best guess
   * available - but the disagreement has to travel with it, or the profile
   * states the middle of the scale with the same confidence it would state a
   * preference somebody repeated four times.
   */
  it('reports two contradictory answers as agreeing about nothing', () => {
    const agreed = foldAxisObservations(
      [
        { value: WANTS_BRIGHT, weight: FULL_WEIGHT },
        { value: WANTS_BRIGHT, weight: FULL_WEIGHT },
      ],
      MAX_DISAGREEMENT,
    );
    const contradicted = foldAxisObservations(
      [
        { value: DISLIKES_SOUR, weight: FULL_WEIGHT },
        { value: WANTS_BRIGHT, weight: FULL_WEIGHT },
      ],
      MAX_DISAGREEMENT,
    );

    expect(agreed?.agreement).toBe(PERFECT);
    expect(contradicted?.agreement).toBe(NOTHING);
    expect(contradicted?.value).toBe(MIDDLE);
  });

  /** Agreement is a share, so it can never go under nothing however far apart. */
  it('never reports a negative agreement', () => {
    const folded = foldAxisObservations(
      [
        { value: TASTE_AXIS_MIN, weight: FULL_WEIGHT },
        { value: TASTE_AXIS_MAX, weight: FULL_WEIGHT },
      ],
      MAX_DISAGREEMENT,
    );

    expect(folded?.agreement).toBe(NOTHING);
  });

  /**
   * Coverage is how much was asked, not how many answers came back. Four
   * indirect questions about an axis are worth more than one direct one, and
   * the profile is entitled to hold the first more firmly.
   */
  it('adds up how much was asked about the axis', () => {
    const observations: readonly AxisObservation[] = [
      { value: WANTS_BRIGHT, weight: INDIRECT_WEIGHT },
      { value: WANTS_BRIGHT, weight: INDIRECT_WEIGHT },
      { value: WANTS_BRIGHT, weight: FULL_WEIGHT },
    ];

    expect(foldAxisObservations(observations, MAX_DISAGREEMENT)?.coverage).toBeCloseTo(
      INDIRECT_WEIGHT + INDIRECT_WEIGHT + FULL_WEIGHT,
    );
  });
});
