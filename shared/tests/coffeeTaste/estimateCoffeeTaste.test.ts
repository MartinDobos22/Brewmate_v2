import { describe, expect, it } from 'vitest';

import {
  COFFEE_ESTIMATE_SOURCES,
  COFFEE_SIGNAL_SOURCES,
  ROAST_LEVELS,
  SIGNAL_WEIGHTS,
  TASTE_AXIS_NEUTRAL,
  estimateCoffeeTaste,
  readCoffeeSignals,
  type CoffeeLabelFacts,
  type CoffeeTasteEstimate,
} from '../../src/index.js';

const NO_CONFIDENCE = 0;
const BRIGHT_ACIDITY = 8;
const FULL_WEIGHT = 1;
const HIGH_ALTITUDE = 2000;
const LOW_ALTITUDE = 700;

const estimate = (coffee: CoffeeLabelFacts): CoffeeTasteEstimate =>
  estimateCoffeeTaste(readCoffeeSignals(coffee));

describe('estimating what a coffee tastes like', () => {
  /**
   * The state a brand-new scan of an unhelpful bag lands in, and the one this
   * has to get right: five middles that openly admit to being five middles,
   * rather than a confident claim that the coffee is unremarkable in every
   * direction.
   */
  it('claims nothing about a bag that says nothing', () => {
    const nothing = estimate({});

    expect(nothing.axes.acidity).toBe(TASTE_AXIS_NEUTRAL);
    expect(nothing.axisConfidence.acidity).toBe(NO_CONFIDENCE);
    expect(nothing.signals).toEqual([]);
  });

  /** The whole point of the feature: one field is still an answer. */
  it('answers from a country alone', () => {
    const ethiopian = estimate({ originCountry: 'Etiópia' });
    const brazilian = estimate({ originCountry: 'Brazília' });

    expect(ethiopian.axes.acidity).toBeGreaterThan(brazilian.axes.acidity);
    expect(brazilian.axes.body).toBeGreaterThan(ethiopian.axes.body);
    expect(ethiopian.axisConfidence.acidity).toBeGreaterThan(NO_CONFIDENCE);
  });

  /** Accents, case and the Slovak spelling all have to reach the same row. */
  it('reads a country however the bag spells it', () => {
    expect(estimate({ originCountry: 'ETIÓPIA' }).axes).toEqual(
      estimate({ originCountry: 'ethiopia' }).axes,
    );
  });

  it('knows a dark roast from a light one', () => {
    const light = estimate({ roastLevel: ROAST_LEVELS.light });
    const dark = estimate({ roastLevel: ROAST_LEVELS.dark });

    expect(light.axes.acidity).toBeGreaterThan(dark.axes.acidity);
    expect(dark.axes.bitterness).toBeGreaterThan(light.axes.bitterness);
    expect(dark.axes.body).toBeGreaterThan(light.axes.body);
  });

  /**
   * The roast has to outweigh the origin, because it moves a cup further: a
   * dark Ethiopian and a light Ethiopian are further apart than a light
   * Ethiopian and a light Kenyan.
   */
  it('lets the roast outweigh the origin', () => {
    const darkEthiopian = estimate({
      originCountry: 'Etiópia',
      roastLevel: ROAST_LEVELS.dark,
    });

    expect(darkEthiopian.axes.acidity).toBeLessThan(TASTE_AXIS_NEUTRAL);
  });

  /**
   * The case this module exists to handle honestly. The origin and the process
   * argue for a bright fruity cup and the roast argues for a heavy bitter one,
   * both readings are correct, and what the label supports is "this could go
   * either way" rather than the midpoint stated firmly.
   */
  it('reports a coffee whose signals contradict each other as uncertain', () => {
    const agreeing = estimate({
      originCountry: 'Etiópia',
      process: 'washed',
      roastLevel: ROAST_LEVELS.light,
    });
    const contradictory = estimate({
      originCountry: 'Etiópia',
      process: 'natural',
      roastLevel: ROAST_LEVELS.dark,
    });

    expect(contradictory.axisConfidence.acidity).toBeLessThan(agreeing.axisConfidence.acidity);
  });

  it('reads the process out of whatever the bag calls it', () => {
    const washed = estimate({ process: 'praná' });
    const natural = estimate({ process: 'Natural' });

    expect(washed.axes.acidity).toBeGreaterThan(natural.axes.acidity);
    expect(natural.axes.sweetness).toBeGreaterThan(washed.axes.sweetness);
  });

  /** Specific stems come first, so an anaerobic lot is not read as a plain natural. */
  it('does not read an anaerobic lot as an ordinary natural', () => {
    const anaerobic = estimate({ process: 'anaeróbne natural' });
    const natural = estimate({ process: 'natural' });

    expect(anaerobic.axes.intensity).toBeGreaterThan(natural.axes.intensity);
  });

  it('reads altitude as bands, from the top down', () => {
    const high = estimate({ altitude: HIGH_ALTITUDE });
    const low = estimate({ altitude: LOW_ALTITUDE });

    expect(high.axes.acidity).toBeGreaterThan(low.axes.acidity);
  });

  /**
   * The richest thing on most bags, and the one that has to work with no
   * signal and no allowance left.
   */
  it('reads the printed tasting notes', () => {
    const bright = estimate({ tastingNotes: ['jahoda', 'ríbezle'] });
    const heavy = estimate({ tastingNotes: ['horká čokoláda', 'tabak'] });

    expect(bright.axes.acidity).toBeGreaterThan(heavy.axes.acidity);
    expect(heavy.axes.body).toBeGreaterThan(bright.axes.body);
    expect(bright.signals).toContain(COFFEE_SIGNAL_SOURCES.tastingNotes);
  });

  /** A note nobody wrote a stem for is silence, not a guess. That is the model's job. */
  it('ignores a note it has no word for', () => {
    expect(estimate({ tastingNotes: ['pačuli a mokrý asfalt'] }).signals).toEqual([]);
  });

  it('names every kind of evidence it used', () => {
    const full = estimate({
      originCountry: 'Keňa',
      variety: 'SL28',
      process: 'washed',
      roastLevel: ROAST_LEVELS.light,
      altitude: HIGH_ALTITUDE,
      tastingNotes: ['ríbezle'],
    });

    expect(full.signals).toHaveLength(Object.keys(SIGNAL_WEIGHTS).length);
    expect(full.source).toBe(COFFEE_ESTIMATE_SOURCES.label);
  });

  /**
   * More of the label read means more confidence, which is the difference
   * between a guess and a reading and the reason `signals` is reported at all.
   */
  it('grows more certain the more the label says', () => {
    const sparse = estimate({ originCountry: 'Keňa' });
    const full = estimate({
      originCountry: 'Keňa',
      process: 'washed',
      roastLevel: ROAST_LEVELS.light,
      tastingNotes: ['ríbezle', 'grep'],
    });

    expect(full.axisConfidence.acidity).toBeGreaterThan(sparse.axisConfidence.acidity);
  });

  /**
   * The source is derived from the evidence rather than declared, so a caller
   * cannot label a rules-only estimate as a model's.
   */
  it('says a model was involved only when one contributed', () => {
    const withModel = estimateCoffeeTaste([
      ...readCoffeeSignals({ originCountry: 'Keňa' }),
      {
        source: COFFEE_SIGNAL_SOURCES.modelReading,
        axes: { acidity: BRIGHT_ACIDITY },
        weight: FULL_WEIGHT,
      },
    ]);

    expect(withModel.source).toBe(COFFEE_ESTIMATE_SOURCES.model);
  });
});
