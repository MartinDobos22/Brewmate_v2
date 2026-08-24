import {
  CONVERSION_PRECISIONS,
  type ConversionNote,
  type ConversionResult,
  type SourceRecipe,
} from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const EMPTY = '';
const NOTHING = 0;
const NOT_STATED = 'not stated';
const NO_STEPS = 'no pour schedule';

const line = (label: string, value: string): string =>
  [PROMPT_BULLET, label, PROMPT_LABEL_SEPARATOR, value].join(EMPTY);

const grams = (value: number | null): string =>
  value === null ? NOT_STATED : `${String(value)} g`;

const seconds = (value: number | null): string =>
  value === null ? NOT_STATED : `${String(value)} s`;

const degrees = (value: number | null): string =>
  value === null ? NOT_STATED : `${String(value)} °C`;

/**
 * The recipe as it was found, before anything was done to it.
 *
 * Sent in full even though the converted numbers follow, because the
 * explanation has to be able to name what changed and why - "the original was
 * written for 500 g of water and your dripper holds 300" is an explanation,
 * and "your dose is 16.2 g" is a label.
 */
export const describeSourceRecipe = (source: SourceRecipe): string =>
  [
    'The recipe this person found, exactly as it was read. Anything marked "not stated" was genuinely not in the original - do not invent what it might have said:',
    line('What it is called', source.label ?? NOT_STATED),
    line('What it was brewed in', source.methodCategory ?? NOT_STATED),
    line('Its dose', grams(source.doseGrams)),
    line('Its water, or an espresso yield', grams(source.waterGrams)),
    line('Its grind, in words', source.grindLabel ?? NOT_STATED),
    line(
      'Its grind, on its own grinder collar',
      source.grindSetting === null ? NOT_STATED : String(source.grindSetting),
    ),
    line('Its temperature', degrees(source.waterTempC)),
    line('Its total time', seconds(source.totalTimeSeconds)),
    line(
      'Its pour schedule',
      source.steps.length === NOTHING ? NO_STEPS : `${String(source.steps.length)} steps`,
    ),
  ].join(PROMPT_LINE_SEPARATOR);

/**
 * Every note the arithmetic produced, in its own machine names.
 *
 * The model is told what the conversion concluded rather than asked to judge
 * it, and the wording is deliberate: these are findings, and the explanation
 * has to reflect them rather than re-derive them. A model that decided for
 * itself which numbers were solid would eventually disagree with the report
 * printed two centimetres below its own sentence.
 */
const describeNotes = (notes: readonly ConversionNote[]): readonly string[] =>
  notes.map((note: ConversionNote): string =>
    line(note.field, `${note.precision} - ${note.reason}`),
  );

/**
 * What the conversion worked out, and how much each number is worth.
 *
 * This is the whole of what the model is allowed to write about. Everything
 * here is already decided and already stored; the answer adds a Slovak word
 * for the grind, an explanation, and - only where the report says a hole was
 * left - a pour schedule.
 */
export const describeConversionResult = (result: ConversionResult): string =>
  [
    'What the conversion worked out for this person, on their own equipment. These numbers are final: they are already computed, there is no field in your answer to change any of them, and a recipe that argued with them would contradict the card printed under it.',
    line('Dose', grams(result.doseGrams)),
    line('Water, or espresso yield', grams(result.waterGrams)),
    line('Ratio', `1:${String(result.ratio)}`),
    line(
      'Grind on their own collar',
      result.grindSetting === null
        ? 'their grinder has no calibration curve, so there is no number to give - the grind has to be described in words'
        : String(result.grindSetting),
    ),
    line(
      'Grind in microns',
      result.grindMicrons === null ? NOT_STATED : String(result.grindMicrons),
    ),
    line(
      'Roughly how coarse that is',
      result.grindDescriptor ?? 'the grind cannot be adjusted for this brew',
    ),
    line('Temperature', degrees(result.waterTempC)),
    line('Total time', seconds(result.totalTimeSeconds)),
    line(
      'Pour schedule',
      result.scheduleMayBeRewritten
        ? 'could not be carried over - write one for this brewer, or leave it out if the method has no schedule worth counting'
        : `${String(result.steps.length)} steps, already scaled to the water above`,
    ),
    '',
    `How much each number is worth. "${CONVERSION_PRECISIONS.exact}" came across untouched or is arithmetic that cannot be wrong, "${CONVERSION_PRECISIONS.estimated}" is a real calculation over approximate inputs, "${CONVERSION_PRECISIONS.unknown}" means the original never said and this is the ordinary figure for the method:`,
    ...describeNotes(result.notes),
  ].join(PROMPT_LINE_SEPARATOR);
