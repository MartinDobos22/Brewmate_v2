import {
  BREW_METHOD_CATEGORIES,
  CALIBRATION_ESTIMATED_BY_DEFAULT,
  DIAL_IN_CHANGES,
  EMPTY_SOURCE_RECIPE,
  GRINDER_TYPICAL_USES,
  GRINDER_UNIT_TYPES,
  type CreateGrinderRequest,
  type SourceRecipe,
} from '@brewmate/shared';

const SOURCE_DOSE_GRAMS = 30;
const SOURCE_WATER_GRAMS = 500;
const SOURCE_GRIND_SETTING = 20;
const SOURCE_TEMP_C = 92;
const SOURCE_TOTAL_SECONDS = 180;
const BLOOM_WATER_GRAMS = 60;
const FINAL_WATER_GRAMS = 500;
const BLOOM_AT_SECOND = 0;
const POUR_AT_SECOND = 45;
const FIRST_STEP = 0;
const SECOND_STEP = 1;

/** Two collars, one 30 microns a click and one 10, both measured over a span. */
const COARSE_LOW_SETTING = 10;
const COARSE_MID_SETTING = 20;
const COARSE_HIGH_SETTING = 30;
const COARSE_LOW_MICRONS = 400;
const COARSE_MID_MICRONS = 700;
const COARSE_HIGH_MICRONS = 1000;
const FINE_LOW_SETTING = 20;
const FINE_HIGH_SETTING = 60;
const FINE_LOW_MICRONS = 400;
const FINE_HIGH_MICRONS = 800;
const COLLAR_MIN = 0;
const COARSE_COLLAR_MAX = 50;
const FINE_COLLAR_MAX = 120;
const ONE_CLICK = 1;
const MEASURED = false;

/**
 * The grinder the imported recipe was written on.
 *
 * Contributed rather than seeded, so the conversion tests can drive the
 * catalogue through the same endpoint a user would - and so the unverified
 * case, which the spec says has to be admitted out loud, is reachable.
 */
export const SOURCE_GRINDER: CreateGrinderRequest = {
  brand: 'Testovaci',
  model: 'Hruby',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: COLLAR_MIN,
  maxSetting: COARSE_COLLAR_MAX,
  step: ONE_CLICK,
  micronCalibration: {
    points: [
      { setting: COARSE_LOW_SETTING, microns: COARSE_LOW_MICRONS },
      { setting: COARSE_MID_SETTING, microns: COARSE_MID_MICRONS },
      { setting: COARSE_HIGH_SETTING, microns: COARSE_HIGH_MICRONS },
    ],
    isEstimated: MEASURED,
  },
  typicalUse: GRINDER_TYPICAL_USES.filter,
};

/** The grinder actually on this person's counter, with an estimated curve. */
export const TARGET_GRINDER: CreateGrinderRequest = {
  brand: 'Testovaci',
  model: 'Jemny',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: COLLAR_MIN,
  maxSetting: FINE_COLLAR_MAX,
  step: ONE_CLICK,
  micronCalibration: {
    points: [
      { setting: FINE_LOW_SETTING, microns: FINE_LOW_MICRONS },
      { setting: FINE_HIGH_SETTING, microns: FINE_HIGH_MICRONS },
    ],
    isEstimated: CALIBRATION_ESTIMATED_BY_DEFAULT,
  },
  typicalUse: GRINDER_TYPICAL_USES.both,
};

/** 700 microns on the target collar: 20 clicks at 400, plus 30 clicks of 10. */
export const EXPECTED_TARGET_SETTING = 50;

/** A pour-over recipe somebody found, complete enough to convert exactly. */
export const TEST_SOURCE_RECIPE: SourceRecipe = {
  ...EMPTY_SOURCE_RECIPE,
  label: 'Tetsu 4:6',
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  doseGrams: SOURCE_DOSE_GRAMS,
  waterGrams: SOURCE_WATER_GRAMS,
  grindSetting: SOURCE_GRIND_SETTING,
  waterTempC: SOURCE_TEMP_C,
  totalTimeSeconds: SOURCE_TOTAL_SECONDS,
  steps: [
    {
      order: FIRST_STEP,
      label: 'Bloom',
      atSecond: BLOOM_AT_SECOND,
      waterGrams: BLOOM_WATER_GRAMS,
      note: null,
    },
    {
      order: SECOND_STEP,
      label: 'Dolievanie',
      atSecond: POUR_AT_SECOND,
      waterGrams: FINAL_WATER_GRAMS,
      note: null,
    },
  ],
};

export const TEST_PARSED_LABEL = 'Tetsu 4:6';
export const TEST_CONVERSION_RATIONALE =
  'Dávku aj vodu som prepočítal presne, mletie je len štartovací bod - kalibrácia tvojho mlynčeka je odhad.';
export const TEST_CONVERTED_GRIND_LABEL = 'stredne hrubé, ako hrubší piesok';

/** What the parser is told it read out of a pasted video description. */
export const TEST_PARSE_ANSWER = JSON.stringify({
  ...TEST_SOURCE_RECIPE,
  grinderBrand: SOURCE_GRINDER.brand,
  grinderModel: SOURCE_GRINDER.model,
});

/** The same reading, from a source that named no grinder and no temperature. */
export const SPARSE_PARSE_ANSWER = JSON.stringify({
  ...EMPTY_SOURCE_RECIPE,
  label: null,
  methodCategory: BREW_METHOD_CATEGORIES.pourOver,
  doseGrams: SOURCE_DOSE_GRAMS,
  grindLabel: 'medium-fine',
  grinderBrand: null,
  grinderModel: null,
});

const conversionAnswer = (extra: Record<string, unknown>): string =>
  JSON.stringify({
    grindLabel: TEST_CONVERTED_GRIND_LABEL,
    rationale: TEST_CONVERSION_RATIONALE,
    constraintHints: [],
    ...extra,
  });

/** A well-behaved explanation that adds nothing it was not asked for. */
export const TEST_CONVERSION_ANSWER = conversionAnswer({});

/**
 * The same explanation with a dose bolted onto it.
 *
 * There is no field for a dose in the answer schema, so this is what a model
 * trying to improve somebody's arithmetic looks like on the wire - and the
 * test asserts the stored recipe is the conversion's number regardless.
 */
export const OVERREACHING_CONVERSION_ANSWER = conversionAnswer({
  doseGrams: SOURCE_DOSE_GRAMS,
  waterGrams: SOURCE_WATER_GRAMS,
  grindSetting: COARSE_MID_SETTING,
});

export const REWRITTEN_STEP_LABEL = 'Predsmáčanie';

/** A schedule written for the brewer the recipe is being converted into. */
export const RESCHEDULED_CONVERSION_ANSWER = conversionAnswer({
  steps: [
    {
      order: FIRST_STEP,
      label: REWRITTEN_STEP_LABEL,
      atSecond: BLOOM_AT_SECOND,
      durationSeconds: null,
      waterGrams: BLOOM_WATER_GRAMS,
      note: null,
    },
  ],
});

export const TEST_DIAL_IN_REPLY =
  'Vytieklo to rýchlo a chutí to kyslo - pomeľ o dva kliky jemnejšie.';
const FINER_GRIND_SETTING = 18;
const HEAVIER_DOSE_GRAMS = 18.5;
const LOW_ACIDITY = 3;

/** One change, the way the mode requires it: the grind and nothing else. */
export const TEST_DIAL_IN_ANSWER = JSON.stringify({
  reply: TEST_DIAL_IN_REPLY,
  change: DIAL_IN_CHANGES.grind,
  grindSetting: FINER_GRIND_SETTING,
  tasteObservation: { axes: { acidity: LOW_ACIDITY } },
});

/**
 * Two changes at once, which is the one thing the mode exists to prevent.
 *
 * The schema is a discriminated union, so this is a validation failure rather
 * than something the service has to refuse after the fact - and the retry gets
 * told why.
 */
export const TWO_CHANGE_DIAL_IN_ANSWER = JSON.stringify({
  reply: TEST_DIAL_IN_REPLY,
  change: DIAL_IN_CHANGES.grind,
  grindSetting: FINER_GRIND_SETTING,
  doseGrams: HEAVIER_DOSE_GRAMS,
  tasteObservation: null,
});

/** The answer that ends a dial-in: the shot was good, change nothing. */
export const SETTLED_DIAL_IN_ANSWER = JSON.stringify({
  reply: 'Toto je ono, nechaj to tak.',
  change: DIAL_IN_CHANGES.none,
  tasteObservation: null,
});

export {
  SOURCE_DOSE_GRAMS,
  SOURCE_WATER_GRAMS,
  SOURCE_GRIND_SETTING,
  SOURCE_TEMP_C,
  SOURCE_TOTAL_SECONDS,
  BLOOM_WATER_GRAMS,
  FINER_GRIND_SETTING,
  LOW_ACIDITY,
};
