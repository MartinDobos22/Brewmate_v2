import { describe, expect, it } from 'vitest';

import {
  BAG_IMPRESSIONS,
  BAG_RATING_STAGES,
  BAG_RATING_TAGS,
  COFFEE_ESTIMATE_SOURCES,
  TASTE_AXIS_NEUTRAL,
  learnFromPurchase,
  learnFromRating,
  resolvePurchaseFactor,
  type BagImpression,
  type BagRatingTag,
  type CoffeeTasteEstimate,
  type RatingInput,
  type TasteAxes,
  type TasteAxisConfidence,
} from '../../src/index.js';

const KNOWN = 0.8;
const UNKNOWN = 0;
const BRIGHT = 8.5;
const MIDDLE = TASTE_AXIS_NEUTRAL;
const SWEET = 7;
const LOW_SWEETNESS = 3;
const LOVED = 5;
const LIKED = 4;
const SHRUG = 3;
const DISLIKED = 2;
const HATED = 1;
const BAG_ID = '8f5c2f70-9a3e-4a54-9b27-6c1f0a0c2b11';
const NOTHING = 0;
const EVERYTHING = 1;

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

/** A bright, sweet coffee whose label says nothing about the other three axes. */
const brightCoffee: CoffeeTasteEstimate = {
  axes: axes({ acidity: BRIGHT, sweetness: SWEET }),
  axisConfidence: confidence({ acidity: KNOWN, sweetness: KNOWN }),
  signals: [],
  source: COFFEE_ESTIMATE_SOURCES.label,
};

/** A coffee nobody could read anything off. */
const blankCoffee: CoffeeTasteEstimate = {
  axes: axes(),
  axisConfidence: confidence(),
  signals: [],
  source: COFFEE_ESTIMATE_SOURCES.label,
};

const rate = (overrides: Partial<RatingInput> = {}): ReturnType<typeof learnFromRating> =>
  learnFromRating({
    coffee: brightCoffee,
    bagId: BAG_ID,
    stage: BAG_RATING_STAGES.halfway,
    stars: LOVED,
    impression: null,
    tags: [],
    ...overrides,
  });

const tagged = (...tags: BagRatingTag[]): ReturnType<typeof learnFromRating> =>
  rate({ stars: SHRUG, tags });

const withImpression = (impression: BagImpression): ReturnType<typeof learnFromRating> =>
  rate({ impression });

describe('learnFromRating', () => {
  /**
   * The stars are pinned to the label: a loved coffee is "somewhere like
   * this", and only where the label actually knows where "this" is.
   */
  it('points a loved coffee towards itself, on the axes its label knows', () => {
    const learnt = rate();

    expect(learnt.axes.acidity).toBe(BRIGHT);
    expect(learnt.axes.sweetness).toBe(SWEET);
    expect(learnt.axes.body).toBeUndefined();
    expect(learnt.weight).toBe(EVERYTHING);
  });

  it('points a disliked coffee away from itself, and less firmly than a liked one', () => {
    const disliked = rate({ stars: HATED });

    expect(disliked.axes.acidity).toBeLessThan(MIDDLE);
    expect(disliked.axes.sweetness).toBeLessThan(MIDDLE);
    expect(disliked.axisWeights?.acidity).toBeLessThan(rate().axisWeights?.acidity ?? NOTHING);
  });

  /** A disliked coffee that sat exactly in the middle of an axis says nothing about it. */
  it('learns nothing about an axis a disliked coffee was neutral on', () => {
    const middling: CoffeeTasteEstimate = {
      ...brightCoffee,
      axes: axes({ acidity: BRIGHT }),
    };

    expect(rate({ coffee: middling, stars: HATED }).axes.sweetness).toBeUndefined();
  });

  it('weighs a four-star rating less than a five-star one', () => {
    expect(rate({ stars: LIKED }).weight).toBeLessThan(rate().weight ?? NOTHING);
  });

  /**
   * Three stars and nothing tapped teaches no axis, and is still recorded: it
   * carries how much of the purchase is left standing.
   */
  it('learns no axis from three stars alone, but keeps the bag and the purchase', () => {
    const shrug = rate({ stars: SHRUG });

    expect(shrug.axes).toEqual({});
    expect(shrug.weight).toBe(NOTHING);
    expect(shrug.bagId).toBe(BAG_ID);
    expect(shrug.purchaseFactor).toBeGreaterThan(NOTHING);
  });

  it('reads "too sour" as a preference under what the coffee had', () => {
    expect(tagged(BAG_RATING_TAGS.tooSour).axes.acidity).toBeLessThan(BRIGHT);
  });

  /** A tag is itself proof there was something to notice, label or no label. */
  it('reads a tag even about an axis the label never mentioned', () => {
    const learnt = learnFromRating({
      coffee: blankCoffee,
      bagId: BAG_ID,
      stage: BAG_RATING_STAGES.halfway,
      stars: SHRUG,
      impression: null,
      tags: [BAG_RATING_TAGS.tooBitter, BAG_RATING_TAGS.flat],
    });

    expect(learnt.axes.bitterness).toBeLessThan(MIDDLE);
    expect(learnt.axes.intensity).toBeGreaterThan(MIDDLE);
    expect(learnt.weight).toBeGreaterThan(NOTHING);
  });

  it('reads a liked sweetness as at least a noticeable one', () => {
    const lowSweetness: CoffeeTasteEstimate = {
      ...brightCoffee,
      axes: axes({ acidity: BRIGHT, sweetness: LOW_SWEETNESS }),
    };

    expect(
      learnFromRating({
        coffee: lowSweetness,
        bagId: BAG_ID,
        stage: BAG_RATING_STAGES.halfway,
        stars: SHRUG,
        impression: null,
        tags: [BAG_RATING_TAGS.sweet],
      }).axes.sweetness,
    ).toBeGreaterThan(MIDDLE);
  });

  it('lets a tag override what the stars said about the same axis', () => {
    const learnt = rate({ tags: [BAG_RATING_TAGS.tooSour] });

    expect(learnt.axes.acidity).toBeLessThan(BRIGHT);
    expect(learnt.axes.sweetness).toBe(SWEET);
  });

  it('turns a flavour tag into a liked flavour', () => {
    expect(tagged(BAG_RATING_TAGS.chocolate).flavorAffinities).toEqual({ chocolate: 1 });
  });

  /**
   * "Different from what I expected" means the label described another coffee,
   * so what the stars are pinned to through the label counts for much less.
   */
  it('believes the label less once somebody says the coffee tasted different', () => {
    expect(withImpression(BAG_IMPRESSIONS.different).axisWeights?.acidity).toBeLessThan(
      withImpression(BAG_IMPRESSIONS.asExpected).axisWeights?.acidity ?? NOTHING,
    );
  });

  it('counts a rating that depended on the recipe as half about the brewing', () => {
    expect(withImpression(BAG_IMPRESSIONS.recipeDependent).weight).toBeLessThan(
      withImpression(BAG_IMPRESSIONS.asExpected).weight ?? NOTHING,
    );
  });

  it('weighs the last cups of a bag less than the middle of it', () => {
    expect(rate({ stage: BAG_RATING_STAGES.finished }).weight).toBeLessThan(
      rate({ stage: BAG_RATING_STAGES.halfway }).weight ?? NOTHING,
    );
  });
});

describe('resolvePurchaseFactor', () => {
  it('leaves a purchase standing when it was exactly what they wanted', () => {
    expect(resolvePurchaseFactor(LOVED, BAG_IMPRESSIONS.asExpected)).toBe(EVERYTHING);
  });

  it('takes nothing from a coffee they would never buy again', () => {
    expect(resolvePurchaseFactor(LIKED, BAG_IMPRESSIONS.wouldNotBuy)).toBe(NOTHING);
  });

  /**
   * "Fine, but not what I imagined" and "not a ten, but at that price" are not
   * no - they are less, and by different amounts.
   */
  it('lowers it for an answer that is neither yes nor no', () => {
    const different = resolvePurchaseFactor(LIKED, BAG_IMPRESSIONS.different);
    const goodValue = resolvePurchaseFactor(LIKED, BAG_IMPRESSIONS.goodValue);
    const recipeDependent = resolvePurchaseFactor(LIKED, BAG_IMPRESSIONS.recipeDependent);

    expect(different).toBeGreaterThan(NOTHING);
    expect(different).toBeLessThan(goodValue);
    expect(goodValue).toBeLessThan(recipeDependent);
    expect(recipeDependent).toBeLessThan(EVERYTHING);
  });

  it('falls back on the stars when no impression was given', () => {
    expect(resolvePurchaseFactor(HATED, null)).toBe(NOTHING);
    expect(resolvePurchaseFactor(DISLIKED, null)).toBeLessThan(resolvePurchaseFactor(SHRUG, null));
    expect(resolvePurchaseFactor(LIKED, null)).toBe(EVERYTHING);
    expect(resolvePurchaseFactor(LOVED, null)).toBe(EVERYTHING);
  });
});

describe('learnFromPurchase', () => {
  it('records the kind of coffee chosen, only where its label says anything', () => {
    const learnt = learnFromPurchase(brightCoffee, BAG_ID);

    expect(learnt?.axes).toEqual({ acidity: BRIGHT, sweetness: SWEET });
    expect(learnt?.axisWeights?.acidity).toBe(KNOWN);
    expect(learnt?.bagId).toBe(BAG_ID);
  });

  /** A coffee nobody can describe teaches nothing about the person who bought it. */
  it('learns nothing from a bag whose label says nothing', () => {
    expect(learnFromPurchase(blankCoffee, BAG_ID)).toBeNull();
  });
});
