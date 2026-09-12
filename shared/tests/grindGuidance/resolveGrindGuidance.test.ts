import { describe, expect, it } from 'vitest';

import {
  BREW_METHOD_CATEGORIES,
  GRIND_DESCRIPTORS,
  GRIND_MICRON_WINDOWS,
  GRIND_SHIFT_SOURCES,
  ROAST_LEVELS,
  UNKNOWN_COFFEE,
  middleOfWindow,
  resolveGrindGuidance,
  type Grinder,
  type GrindCoffeeFacts,
  type GrindGuidance,
  type GrindShift,
  type GrindShiftSource,
} from '../../src/index.js';
import {
  COARSE_MICRONS_PER_CLICK,
  CONTRIBUTED_GRINDER,
  ESTIMATED_GRINDER,
  MEASURED_GRINDER,
  UNCALIBRATED_GRINDER,
} from '../conversion/testGrinders.js';

import { ESPRESSO_GRINDER, REVERSED_GRINDER } from './testGuidanceGrinders.js';

const NOTHING = 0;
const RESTED_DAYS = 10;
const STILL_DEGASSING_DAYS = 2;
const LONG_FORGOTTEN_DAYS = 90;

const sources = (shifts: readonly GrindShift[]): readonly GrindShiftSource[] =>
  shifts.map((shift: GrindShift): GrindShiftSource => shift.source);

const coffee = (facts: Partial<GrindCoffeeFacts>): GrindCoffeeFacts => ({
  ...UNKNOWN_COFFEE,
  ...facts,
});

const pourOver = (
  facts: GrindCoffeeFacts,
  grinder: Grinder | null = MEASURED_GRINDER,
): GrindGuidance =>
  resolveGrindGuidance({
    methodCategory: BREW_METHOD_CATEGORIES.pourOver,
    coffee: facts,
    grinder,
  });

describe('where to start grinding a coffee nobody has written anything down about', () => {
  /**
   * The one case the whole feature has to survive: a bag with no label facts
   * at all still has to produce a place to put the collar, and it has to be
   * visibly a default rather than a reading of a coffee.
   */
  it('lands in the middle of the method window, with no reasons attached', () => {
    const guidance = pourOver(UNKNOWN_COFFEE);

    expect(guidance.microns.target).toBe(
      middleOfWindow(GRIND_MICRON_WINDOWS[BREW_METHOD_CATEGORIES.pourOver]),
    );
    expect(guidance.shifts).toHaveLength(NOTHING);
  });

  it('still says which grind it means in words', () => {
    expect(pourOver(UNKNOWN_COFFEE).descriptor).toBe(GRIND_DESCRIPTORS.medium);
  });

  it('gives a different starting point for a different brewer', () => {
    const filter = pourOver(UNKNOWN_COFFEE).microns.target;
    const espresso = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.espresso,
      coffee: UNKNOWN_COFFEE,
      grinder: MEASURED_GRINDER,
    }).microns.target;

    expect(espresso).toBeLessThan(filter);
  });
});

describe('what the bag moves', () => {
  it('starts a dark roast coarser than a light one in the same brewer', () => {
    const dark = pourOver(coffee({ roastLevel: ROAST_LEVELS.dark })).microns.target;
    const light = pourOver(coffee({ roastLevel: ROAST_LEVELS.light })).microns.target;

    expect(dark).toBeGreaterThan(light);
  });

  it('starts a natural coarser than a washed coffee of the same roast', () => {
    const natural = pourOver(coffee({ roastLevel: ROAST_LEVELS.medium, process: 'natural' }))
      .microns.target;
    const washed = pourOver(coffee({ roastLevel: ROAST_LEVELS.medium, process: 'prané' })).microns
      .target;

    expect(natural).toBeGreaterThan(washed);
  });

  it('reads the specific fermentation rather than the general word inside it', () => {
    const anaerobic = pourOver(coffee({ process: 'anaeróbne natural' })).shifts;
    const plain = pourOver(coffee({ process: 'natural' })).shifts;

    expect(anaerobic).not.toStrictEqual(plain);
  });

  /**
   * Both ends of the shelf life pull the same way and for opposite reasons -
   * a bag still degassing brews thin, and a bag past its month has lost what
   * made it worth buying. Either way the answer is a finer grind, and a table
   * that treated one of them as the normal case would send somebody the wrong
   * way on half the coffee in their cupboard.
   */
  it('grinds finer for a coffee that is still degassing and for one that is long past its peak', () => {
    const middle = pourOver(coffee({ daysSinceRoast: RESTED_DAYS })).microns.target;

    expect(pourOver(coffee({ daysSinceRoast: STILL_DEGASSING_DAYS })).microns.target).toBeLessThan(
      middle,
    );
    expect(pourOver(coffee({ daysSinceRoast: LONG_FORGOTTEN_DAYS })).microns.target).toBeLessThan(
      middle,
    );
  });

  it('names every fact that moved the grind', () => {
    const guidance = pourOver(
      coffee({
        roastLevel: ROAST_LEVELS.dark,
        process: 'natural',
        daysSinceRoast: STILL_DEGASSING_DAYS,
      }),
    );

    expect(sources(guidance.shifts)).toStrictEqual([
      GRIND_SHIFT_SOURCES.roastLevel,
      GRIND_SHIFT_SOURCES.process,
      GRIND_SHIFT_SOURCES.restDays,
    ]);
  });

  /**
   * The bag decides where in the window to stand. It does not get to leave it:
   * a dark natural is still a pour-over grind, and a starting point outside
   * the range the method is brewed in is not a starting point.
   */
  it('never pushes the starting point outside the method window', () => {
    const window = GRIND_MICRON_WINDOWS[BREW_METHOD_CATEGORIES.pourOver];
    const extreme = pourOver(
      coffee({
        roastLevel: ROAST_LEVELS.dark,
        process: 'anaeróbne',
        daysSinceRoast: RESTED_DAYS,
      }),
    );

    expect(extreme.microns.target).toBeLessThanOrEqual(window.max);
    expect(extreme.microns.min).toBeGreaterThanOrEqual(window.min);
    expect(extreme.microns.max).toBeLessThanOrEqual(window.max);
  });

  /**
   * A shift is a fraction of the family's own window rather than a figure in
   * microns, so that one notch of roast is the same amount of taste in an
   * espresso as in a cold brew. In microns it is necessarily a bigger number
   * in the wider window, and that is the arithmetic working rather than a bug.
   */
  it('scales what a roast is worth to the window the method is brewed in', () => {
    const roasted = coffee({ roastLevel: ROAST_LEVELS.dark });
    const inEspresso = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.espresso,
      coffee: roasted,
      grinder: null,
    });
    const inCold = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.cold,
      coffee: roasted,
      grinder: null,
    });
    const movedBy = (
      guidance: typeof inCold,
      category: keyof typeof GRIND_MICRON_WINDOWS,
    ): number => guidance.microns.target - middleOfWindow(GRIND_MICRON_WINDOWS[category]);

    expect(movedBy(inCold, BREW_METHOD_CATEGORIES.cold)).toBeGreaterThan(
      movedBy(inEspresso, BREW_METHOD_CATEGORIES.espresso),
    );
  });
});

describe('putting the answer on somebody own collar', () => {
  it('turns the band into numbers on a calibrated grinder', () => {
    const guidance = pourOver(UNKNOWN_COFFEE);

    expect(guidance.setting?.min).toBeLessThan(guidance.setting?.target ?? NOTHING);
    expect(guidance.setting?.max).toBeGreaterThan(guidance.setting?.target ?? NOTHING);
  });

  /**
   * A grinder nobody has put a micron figure to is a normal entry in the
   * catalogue, not a broken one. It gets the word and nothing else, which is
   * what an honest app says rather than inventing a scale to print a number on.
   */
  it('gives a word and no number when the grinder has no curve', () => {
    const guidance = pourOver(UNKNOWN_COFFEE, UNCALIBRATED_GRINDER);

    expect(guidance.setting).toBeNull();
    expect(guidance.step).toBeNull();
    expect(guidance.descriptor).toBe(GRIND_DESCRIPTORS.medium);
  });

  it('gives a word and no number when there is no grinder at all', () => {
    const guidance = pourOver(UNKNOWN_COFFEE, null);

    expect(guidance.setting).toBeNull();
    expect(guidance.descriptor).toBe(GRIND_DESCRIPTORS.medium);
  });

  it('reports a collar marked the other way round the right way up', () => {
    const guidance = pourOver(UNKNOWN_COFFEE, REVERSED_GRINDER);

    expect(guidance.setting?.min).toBeLessThan(guidance.setting?.max ?? NOTHING);
  });

  it('says so when the curve behind the numbers is only an estimate', () => {
    expect(pourOver(UNKNOWN_COFFEE, ESTIMATED_GRINDER).isCollarEstimated).toBe(true);
  });

  it('says so when the catalogue entry is somebody own contribution', () => {
    expect(pourOver(UNKNOWN_COFFEE, CONTRIBUTED_GRINDER).isCollarEstimated).toBe(true);
  });

  it('claims nothing extra for a measured curve on a verified entry', () => {
    expect(pourOver(UNKNOWN_COFFEE).isCollarEstimated).toBe(false);
  });
});

describe('how far to move the collar', () => {
  /**
   * The number a cafe dialling in a new bag is paying for. Half a click is not
   * an instruction, and a move rounded down to nothing would send somebody to
   * pull the same shot twice.
   */
  it('is always at least one step of the collar', () => {
    const guidance = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.espresso,
      coffee: UNKNOWN_COFFEE,
      grinder: ESPRESSO_GRINDER,
    });

    expect(guidance.step?.settings).toBeGreaterThanOrEqual(ESPRESSO_GRINDER.step);
  });

  /**
   * The same change in the cup is more clicks on a collar that moves less per
   * click. This is the whole reason the advice is computed per grinder rather
   * than written into a prompt as "one or two clicks".
   */
  it('asks for more clicks on a fine collar than on a coarse one', () => {
    const fine = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.espresso,
      coffee: UNKNOWN_COFFEE,
      grinder: ESPRESSO_GRINDER,
    });
    const coarse = resolveGrindGuidance({
      methodCategory: BREW_METHOD_CATEGORIES.espresso,
      coffee: UNKNOWN_COFFEE,
      grinder: MEASURED_GRINDER,
    });

    expect(fine.step?.micronsPerSetting).toBeLessThan(coarse.step?.micronsPerSetting ?? NOTHING);
    expect(fine.step?.settings).toBeGreaterThan(coarse.step?.settings ?? NOTHING);
  });

  it('reports what one unit of the collar is actually worth', () => {
    expect(pourOver(UNKNOWN_COFFEE).step?.micronsPerSetting).toBe(COARSE_MICRONS_PER_CLICK);
  });
});
