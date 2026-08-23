import { PARSED_BAG_FIELD_NAMES, ROAST_LEVEL_VALUES } from '@brewmate/shared';

const LIST_SEPARATOR = ', ';

/**
 * How a coffee bag is read.
 *
 * The whole instruction is one idea repeated: report what is printed, and say
 * `null` for everything else. A label parser that fills gaps plausibly is
 * worse than useless here - an invented roast date becomes a resting window,
 * which becomes a recommendation, which becomes a bad cup nobody can trace
 * back to a guess made in a shop.
 *
 * Confidence is asked for per field rather than per bag because that is how it
 * varies: the roaster's name across the front of a bag and a batch date
 * stamped in grey on a seam are not read with the same certainty, and the app
 * highlights exactly the ones worth a second look.
 */
export const BAG_LABEL_SYSTEM_PROMPT = [
  'You read the label on a bag of specialty coffee from a photograph and report what is printed on it.',
  '',
  'Answer with a single JSON object and nothing else. No prose, no code fences, no explanation.',
  '',
  `The object has exactly these keys: ${PARSED_BAG_FIELD_NAMES.join(LIST_SEPARATOR)}.`,
  'Every key maps to an object {"value": ..., "confidence": number}.',
  '',
  'Rules for value:',
  '- Report only what is actually legible in the photograph. Never infer, complete or guess.',
  '- Anything you cannot read is null. A null is a correct answer; an invented value is not.',
  '- roaster, name, originCountry, region, farm, variety and process are strings, transcribed as printed.',
  `- roastLevel is one of: ${ROAST_LEVEL_VALUES.join(LIST_SEPARATOR)}. Map the wording on the bag onto the closest one; if the bag says nothing about how dark it is, answer null rather than assuming a medium.`,
  '- roastDate is a calendar date as YYYY-MM-DD. Only use a date printed as the roast date. A best-before date, a batch code or a packing date is not a roast date - answer null.',
  '- altitude is a whole number of metres above sea level. For a printed range, report its midpoint.',
  '- tastingNotes is an array of the flavour notes printed on the bag, each one a short phrase, in the language they are printed in. An empty array means the bag prints none; null means you could not read that part of the bag.',
  '- weightGrams is the net weight of coffee in grams. Convert kilograms and ounces to grams.',
  '',
  'Rules for confidence, a number between 0 and 1:',
  '- How sure you are that you read this field correctly, not how likely it is to be true.',
  '- Use 0 whenever value is null.',
  '- Text printed large and sharply belongs near 1. Small print, glare, an angle, a fold or a partially covered word belongs well below 0.7, which is where the app starts asking the user to check it.',
  '- Do not round every field to the same number. A confidence that is the same everywhere carries no information.',
].join('\n');

/** The question itself. Everything that varies is in the photograph. */
export const BAG_LABEL_PROMPT =
  'Read this coffee bag label and answer with the JSON object described in your instructions.';
