import { describe, expect, it } from 'vitest';

import {
  COFFEE_ESTIMATE_SOURCES,
  MATCH_BANDS,
  MATCH_DIRECTIONS,
  MILK_USAGE_LEVELS,
  TASTE_AXIS_NEUTRAL,
  matchCoffeeToProfile,
  type AxisMatch,
  type CoffeeTasteEstimate,
  type DrinkerTaste,
  type TasteAxes,
  type TasteAxisConfidence,
} from '../../src/index.js';

const NOTHING = 0;
const KNOWN = 0.9;
const UNKNOWN = 0;
const BRIGHT = 8.5;
const FLAT = 2.5;
const MIDDLE = TASTE_AXIS_NEUTRAL;
const LIGHT_BODY = 3.5;
const HEAVY_BODY = 9;
const THIN_BODY = 3;
const SWEET = 7;
const VERY_BITTER = 8.5;
const NOT_BITTER = 2;
const ROUNDED = 5.5;
const SOME_SWEETNESS = 6;
const MID_BODY = 4;
const NEAR_BRIGHT = 7;
const ALSO_NEAR_BRIGHT = 7.5;
const BARELY_KNOWN = 0.2;
const EVERY_AXIS = 5;

const axes = (overrides: Partial<TasteAxes> = {}): TasteAxes => ({
  acidity: MIDDLE,
  sweetness: MIDDLE,
  body: MIDDLE,
  bitterness: MIDDLE,
  intensity: MIDDLE,
  ...overrides,
});

const confidence = (overrides: Partial<TasteAxisConfidence> = {}): TasteAxisConfidence => ({
  acidity: UNKNOWN,
  sweetness: UNKNOWN,
  body: UNKNOWN,
  bitterness: UNKNOWN,
  intensity: UNKNOWN,
  ...overrides,
});

const coffee = (
  values: Partial<TasteAxes>,
  known: Partial<TasteAxisConfidence>,
): CoffeeTasteEstimate => ({
  axes: axes(values),
  axisConfidence: confidence(known),
  signals: [],
  source: COFFEE_ESTIMATE_SOURCES.label,
});

const drinker = (
  values: Partial<TasteAxes>,
  known: Partial<TasteAxisConfidence>,
  milkUsage: DrinkerTaste['milkUsage'] = MILK_USAGE_LEVELS.never,
): DrinkerTaste => ({
  ...axes(values),
  axisConfidence: confidence(known),
  milkUsage,
});

const forAxis = (matches: readonly AxisMatch[], axis: string): AxisMatch | undefined =>
  matches.find((match: AxisMatch): boolean => match.axis === axis);

describe('holding a coffee up against the person drinking it', () => {
  /**
   * The rule the whole module turns on. Either side being blank ends the
   * comparison, because the alternative is the app arguing about somebody's
   * bitterness on the strength of having read a bag.
   */
  it('refuses to compare an axis the person has never spoken about', () => {
    const match = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, { acidity: KNOWN }),
      drinker({ acidity: FLAT }, { acidity: UNKNOWN }),
    );

    expect(forAxis(match.axes, 'acidity')?.isComparable).toBe(false);
    expect(match.comparable).toHaveLength(NOTHING);
    expect(match.band).toBe(MATCH_BANDS.unknown);
    expect(match.fit).toBeNull();
  });

  it('refuses to compare an axis the label said nothing about', () => {
    const match = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, { acidity: UNKNOWN }),
      drinker({ acidity: FLAT }, { acidity: KNOWN }),
    );

    expect(match.comparable).toHaveLength(NOTHING);
    expect(match.band).toBe(MATCH_BANDS.unknown);
  });

  /** One axis out of five is an anecdote, not a comparison. */
  it('does not call one comparable axis a comparison', () => {
    const match = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, { acidity: KNOWN }),
      drinker({ acidity: BRIGHT }, { acidity: KNOWN }),
    );

    expect(match.comparable).toHaveLength(1);
    expect(match.band).toBe(MATCH_BANDS.unknown);
  });

  it('says which way a coffee misses', () => {
    const tooBright = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, { acidity: KNOWN }),
      drinker({ acidity: FLAT }, { acidity: KNOWN }),
    );
    const tooFlat = matchCoffeeToProfile(
      coffee({ acidity: FLAT }, { acidity: KNOWN }),
      drinker({ acidity: BRIGHT }, { acidity: KNOWN }),
    );

    expect(forAxis(tooBright.axes, 'acidity')?.direction).toBe(MATCH_DIRECTIONS.above);
    expect(forAxis(tooFlat.axes, 'acidity')?.direction).toBe(MATCH_DIRECTIONS.below);
  });

  /** A point either way is inside the noise of everything upstream. */
  it('does not call a difference nobody could taste a mismatch', () => {
    const match = matchCoffeeToProfile(
      coffee({ acidity: NEAR_BRIGHT }, { acidity: KNOWN }),
      drinker({ acidity: ALSO_NEAR_BRIGHT }, { acidity: KNOWN }),
    );

    expect(forAxis(match.axes, 'acidity')?.direction).toBe(MATCH_DIRECTIONS.aligned);
  });

  it('calls a coffee that meets a well-known person a match', () => {
    const known = { acidity: KNOWN, body: KNOWN, sweetness: KNOWN };
    const match = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT, body: LIGHT_BODY, sweetness: SWEET }, known),
      drinker({ acidity: BRIGHT, body: LIGHT_BODY, sweetness: SWEET }, known),
    );

    expect(match.band).toBe(MATCH_BANDS.match);
  });

  it('calls a coffee that misses on every known axis a mismatch', () => {
    const known = { acidity: KNOWN, body: KNOWN, bitterness: KNOWN };
    const match = matchCoffeeToProfile(
      coffee({ acidity: FLAT, body: HEAVY_BODY, bitterness: VERY_BITTER }, known),
      drinker({ acidity: BRIGHT, body: THIN_BODY, bitterness: NOT_BITTER }, known),
    );

    expect(match.band).toBe(MATCH_BANDS.mismatch);
  });

  /**
   * The ordinary case for most coffees, and not a hedge: a coffee that suits
   * somebody's body and not their acidity genuinely is both.
   */
  it('calls a coffee that suits one axis and not another mixed', () => {
    const known = { acidity: KNOWN, body: KNOWN, sweetness: KNOWN };
    const match = matchCoffeeToProfile(
      coffee({ acidity: FLAT, body: MID_BODY, sweetness: SWEET }, known),
      drinker({ acidity: BRIGHT, body: MID_BODY, sweetness: SWEET }, known),
    );

    expect(match.band).toBe(MATCH_BANDS.mixed);
  });

  /**
   * The order the verdict argues in. A well-known axis sitting halfway is
   * worth saying nothing about; a well-known axis at an extreme is the
   * sentence to lead with.
   */
  it('leads with the axis that says the most', () => {
    const known = { acidity: KNOWN, body: KNOWN, sweetness: KNOWN };
    const match = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT, body: MIDDLE, sweetness: SOME_SWEETNESS }, known),
      drinker({ acidity: FLAT, body: MIDDLE, sweetness: SOME_SWEETNESS }, known),
    );

    expect(match.comparable[NOTHING]?.axis).toBe('acidity');
  });

  /**
   * A label describes a coffee brewed black; a profile describes the cup
   * somebody puts to their mouth. Without this, a latte drinker is told every
   * interesting coffee on the shelf is too sharp for them.
   */
  it('compares the cup a milk drinker will actually pour', () => {
    const known = { acidity: KNOWN };
    const brightCoffee = coffee({ acidity: BRIGHT }, known);
    const wantsRounded = { acidity: ROUNDED };

    const black = matchCoffeeToProfile(
      brightCoffee,
      drinker(wantsRounded, known, MILK_USAGE_LEVELS.never),
    );
    const withMilk = matchCoffeeToProfile(
      brightCoffee,
      drinker(wantsRounded, known, MILK_USAGE_LEVELS.always),
    );

    expect(forAxis(withMilk.axes, 'acidity')?.coffeeValue).toBeLessThan(
      forAxis(black.axes, 'acidity')?.coffeeValue ?? NOTHING,
    );
    expect(forAxis(withMilk.axes, 'acidity')?.fit).toBeGreaterThan(
      forAxis(black.axes, 'acidity')?.fit ?? NOTHING,
    );
  });

  it('leaves the coffee alone for somebody who never adds milk', () => {
    const known = { acidity: KNOWN };
    const match = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, known),
      drinker({ acidity: BRIGHT }, known, MILK_USAGE_LEVELS.never),
    );

    expect(forAxis(match.axes, 'acidity')?.coffeeValue).toBe(BRIGHT);
  });

  /**
   * A weight is the product of both sides, so a confidently-read label against
   * a barely-known person still counts for little. An average would let the
   * label carry the person.
   */
  it('counts an axis only as far as the weaker side knows it', () => {
    const bothSure = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, { acidity: KNOWN }),
      drinker({ acidity: FLAT }, { acidity: KNOWN }),
    );
    const personVague = matchCoffeeToProfile(
      coffee({ acidity: BRIGHT }, { acidity: KNOWN }),
      drinker({ acidity: FLAT }, { acidity: BARELY_KNOWN }),
    );

    expect(forAxis(personVague.axes, 'acidity')?.weight).toBeLessThan(
      forAxis(bothSure.axes, 'acidity')?.weight ?? NOTHING,
    );
  });

  /** All five are always reported, so a screen can draw what it cannot argue from. */
  it('reports every axis whether or not it could be compared', () => {
    const match = matchCoffeeToProfile(coffee({}, {}), drinker({}, {}));

    expect(match.axes).toHaveLength(EVERY_AXIS);
    expect(match.coverage).toBe(NOTHING);
  });
});
