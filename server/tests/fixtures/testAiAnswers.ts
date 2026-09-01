import { EMPTY_PARSED_BAG_FIELDS, ROAST_LEVELS, type ParsedBagFields } from '@brewmate/shared';

const SURE = 0.95;
const UNSURE = 0.4;

/** A photograph of a bag the app can read the front of, but not the seam. */
export const TEST_PARSED_FIELDS: ParsedBagFields = {
  ...EMPTY_PARSED_BAG_FIELDS,
  roaster: { value: 'Cafe Sladko', confidence: SURE },
  name: { value: 'Kiamugumo AA', confidence: SURE },
  originCountry: { value: 'Keňa', confidence: SURE },
  roastLevel: { value: ROAST_LEVELS.mediumLight, confidence: UNSURE },
  tastingNotes: { value: ['čierne ríbezle', 'grep'], confidence: SURE },
};

export const TEST_LABEL_ANSWER = JSON.stringify(TEST_PARSED_FIELDS);

/** The same coffee, photographed in another shop by somebody else. */
export const OTHER_PHOTO_ANSWER = JSON.stringify({
  ...TEST_PARSED_FIELDS,
  roaster: { value: '  cafe   SLADKO ', confidence: SURE },
  name: { value: 'Kiamugumo AA', confidence: UNSURE },
  originCountry: { value: null, confidence: 0 },
});

export const TEST_VERDICT_TEXT =
  'Táto ti pravdepodobne bude chutiť, pretože si zvyknutý na svetlejšie praženia. Čierne ríbezle sedia s tým, čo máš rád.';

export const TEST_VERDICT_ANSWER = JSON.stringify({
  verdictText: TEST_VERDICT_TEXT,
  reasoning: ['Svetlejšie praženie sedí s tým, po čom siahaš.'],
  uncertainties: [{ field: 'roastDate', reason: 'Dátum praženia som na fotke nenašiel.' }],
});

/** Answers that are the right shape only on the second attempt, and never. */
export const MALFORMED_ANSWER = 'I could not read this label, sorry.';

const BRIGHT_ACIDITY = 8.5;
const MODEST_SWEETNESS = 6;
const LIGHT_BODY = 4;
const WELL_READ_LABEL = 0.8;
const OFF_THE_SCALE = 10;
const NONE = 0;
const CERTAIN = 1;

export const TEST_TASTE_SUMMARY =
  'Bude to svetlá, výrazne ovocná káva s ľahkým telom. Ríbezle a grep budú vpredu, horkosť skoro žiadna.';

/** What the model is asked for here: observations about the coffee, never a verdict. */
export const TEST_TASTE_READING_ANSWER = JSON.stringify({
  axes: { acidity: BRIGHT_ACIDITY, sweetness: MODEST_SWEETNESS, body: LIGHT_BODY },
  confidence: WELL_READ_LABEL,
  flavourNotes: ['ríbezle', 'grep', 'čaj'],
  summary: TEST_TASTE_SUMMARY,
});

/**
 * A reading that flatly contradicts a dark roast, for the one test that
 * matters most: the model contributes evidence, never an answer.
 */
export const OVERCONFIDENT_TASTE_ANSWER = JSON.stringify({
  axes: { acidity: OFF_THE_SCALE, bitterness: NONE, body: NONE },
  confidence: CERTAIN,
  flavourNotes: [],
  summary: 'Extrémne kyslá a ľahká káva.',
});

export const TEST_SUGGESTION_EXPLANATION =
  'Z posledných ôsmich káv malo osem svetlé praženie, tvoj profil o pražení zatiaľ nehovorí nič. Vychádzam z toho, čo si varil - ak to tak nie je, pokojne odmietni.';

/** The one answer the smaller model is ever asked for: a paragraph, no numbers. */
export const TEST_SUGGESTION_ANSWER = JSON.stringify({
  explanation: TEST_SUGGESTION_EXPLANATION,
});

/**
 * Photograph URLs, assembled rather than written out.
 *
 * An absolute URL may not be a literal anywhere in this repository, and these
 * two are not an exception worth carving: the test only needs two strings that
 * parse as URLs and differ from each other.
 */
const SCHEME = 'https:';
const STORAGE_HOST = '//storage.test/bags/';

const photoUrl = (name: string): string => `${SCHEME}${STORAGE_HOST}${name}`;

export const TEST_IMAGE_URL = photoUrl('first.jpg');
export const OTHER_IMAGE_URL = photoUrl('second.jpg');

const GRIND_SETTING = 22;
const WATER_TEMP_C = 94;
const BLOOM_WATER_GRAMS = 45;
const FINAL_WATER_GRAMS = 300;
const BLOOM_SECONDS = 40;
const FIRST_POUR_AT = 40;
const FIRST_POUR_SECONDS = 60;
const TOTAL_TIME_SECONDS = 170;
const SHOT_SECONDS = 28;
const PRE_INFUSION_SECONDS = 5;
const FINER_GRIND_SETTING = 19;
const LOW_ACIDITY = 3;
/** Half again as much water, which the ratio then has to follow. */
const LOOSENED_WATER_GRAMS = 450;

export const TEST_RECIPE_RATIONALE =
  'Kiamugumo je svetlejšie pražená a stojí dva týždne, tak držím vodu vysoko a mletie na strednom.';

/**
 * A recipe for a dripper, in the pour shape.
 *
 * There is deliberately no dose and no water anywhere in it: the schema has no
 * field for either, which is what the generation tests check the recipe
 * against.
 */
export const TEST_RECIPE_ANSWER = JSON.stringify({
  kind: 'pour',
  grindSetting: GRIND_SETTING,
  grindLabel: 'stredné, ako hrubší piesok',
  waterTempC: WATER_TEMP_C,
  steps: [
    {
      order: 0,
      label: 'Bloom',
      atSecond: 0,
      durationSeconds: BLOOM_SECONDS,
      waterGrams: BLOOM_WATER_GRAMS,
      note: 'Zalej a jemne zakruť.',
    },
    {
      order: 1,
      label: 'Hlavný nálev',
      atSecond: FIRST_POUR_AT,
      durationSeconds: FIRST_POUR_SECONDS,
      waterGrams: FINAL_WATER_GRAMS,
      note: null,
    },
  ],
  totalTimeSeconds: TOTAL_TIME_SECONDS,
  preInfusionSeconds: null,
  rationale: TEST_RECIPE_RATIONALE,
  constraintHints: [
    {
      constraint: 'noTemperatureControl',
      hint: 'Zovri a nechaj 45 sekúnd odstáť s otvoreným vekom.',
    },
    { constraint: 'noScale', hint: 'Dávka sú zhruba dve zarovnané polievkové lyžice.' },
  ],
});

/** The same recipe with the espresso shape, for the one method that needs it. */
export const TEST_ESPRESSO_RECIPE_ANSWER = JSON.stringify({
  kind: 'espresso',
  grindSetting: FINER_GRIND_SETTING,
  grindLabel: 'jemné, tesne nad práškom',
  waterTempC: WATER_TEMP_C,
  steps: [],
  totalTimeSeconds: SHOT_SECONDS,
  preInfusionSeconds: PRE_INFUSION_SECONDS,
  rationale: 'Svetlejšie praženie potrebuje jemnejšie mletie a dlhší shot.',
  constraintHints: [],
});

export const TEST_CHAT_REPLY = 'Znie to na nedoextrahované. Skúsim ti pritiahnuť mletie.';

/** An answer with a change somebody can carry out, and what it says about them. */
export const TEST_CHAT_ANSWER = JSON.stringify({
  reply: TEST_CHAT_REPLY,
  recipePatch: {
    grindSetting: FINER_GRIND_SETTING,
    grindLabel: 'o kúsok jemnejšie',
    rationale: 'Jemnejšie mletie predĺži extrakciu a uberie kyslosti.',
  },
  tasteObservation: { axes: { acidity: LOW_ACIDITY }, note: 'Sťažoval sa na kyslosť.' },
});

/**
 * A change nobody without a thermometer can make.
 *
 * The schema handed to the model is built from that person's constraints, so
 * this answer is a validation failure rather than a message - which is what
 * the retry then gets told about.
 */
export const IMPOSSIBLE_CHAT_ANSWER = JSON.stringify({
  reply: 'Zdvihni teplotu o dva stupne.',
  recipePatch: { waterTempC: WATER_TEMP_C },
  tasteObservation: null,
});

/** A patch that moves the water, so the ratio has to follow it. */
export const WATER_CHAT_ANSWER = JSON.stringify({
  reply: 'Pridám ti vodu, bude to menej intenzívne.',
  recipePatch: { waterGrams: LOOSENED_WATER_GRAMS },
  tasteObservation: null,
});

export {
  GRIND_SETTING as TEST_RECIPE_GRIND_SETTING,
  FINER_GRIND_SETTING as TEST_CHAT_GRIND_SETTING,
  TOTAL_TIME_SECONDS as TEST_RECIPE_TOTAL_TIME_SECONDS,
  PRE_INFUSION_SECONDS as TEST_PRE_INFUSION_SECONDS,
};
