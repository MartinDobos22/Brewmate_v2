import {
  EVENT_NOTE_MAX_LENGTH,
  type PartialTasteAxes,
  type TasteProfileEventPayload,
} from '@brewmate/shared';

import { normalizeText } from '../../../lib/text';
import { CALIBRATION_EVENT_WEIGHT } from '../constants/calibrationRecipe';
import { CALIBRATION_LEXICON } from '../constants/calibrationLexicon';

import type { CalibrationEntry, CalibrationReading } from './calibrationLexiconTypes';

const NOTHING = 0;
const NO_WEIGHT = 0;
const START = 0;
const NOT_FOUND = -1;
const STEM_SEPARATOR = ' ';

export interface CalibrationUnderstanding {
  readonly readings: readonly CalibrationReading[];
  readonly payload: TasteProfileEventPayload;
}

/**
 * A term is one stem, or several that have to turn up in order.
 *
 * The second form is what catches "chýbala *jej* sladkosť": Slovak drops a
 * pronoun or an adverb between the complaint and the thing complained about,
 * and a contiguous substring would miss every sentence that reads naturally.
 */
const follows = (text: string, term: string): boolean => {
  let from = START;

  for (const stem of term.split(STEM_SEPARATOR)) {
    const at = text.indexOf(stem, from);

    if (at === NOT_FOUND) {
      return false;
    }

    from = at + stem.length;
  }

  return true;
};

const mentions = (text: string, entry: CalibrationEntry): boolean =>
  entry.terms.some((term: string): boolean => follows(text, term));

/** An axis already spoken for is not claimed twice by a vaguer phrase. */
const claims = (axes: PartialTasteAxes, entry: CalibrationEntry): boolean =>
  Object.keys(entry.axes).every((axis: string): boolean => !(axis in axes));

/**
 * Reads a free description of a cup.
 *
 * A keyword lexicon rather than a model: it is deterministic, it runs offline,
 * and - the part that matters - it can be shown back to the drinker word for
 * word before anything is written. "Rozumiem tomu takto" is only an honest
 * sentence if the app really can say what it understood.
 *
 * Understanding nothing is a normal outcome, and produces a payload that moves
 * no axis at all rather than a guess.
 */
export const readCalibrationDescription = (description: string): CalibrationUnderstanding => {
  const text = normalizeText(description);
  const readings: CalibrationReading[] = [];
  let axes: PartialTasteAxes = {};

  for (const entry of CALIBRATION_LEXICON) {
    if (mentions(text, entry) && claims(axes, entry)) {
      readings.push(entry.reading);
      axes = { ...axes, ...entry.axes };
    }
  }

  return {
    readings,
    payload: {
      axes,
      flavorAffinities: {},
      weight: readings.length === NOTHING ? NO_WEIGHT : CALIBRATION_EVENT_WEIGHT,
      note: description.trim().slice(START, EVENT_NOTE_MAX_LENGTH),
    },
  };
};
