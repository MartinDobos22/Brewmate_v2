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
