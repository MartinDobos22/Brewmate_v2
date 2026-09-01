import { ROAST_LEVEL_VALUES, type RoastLevel } from '../enums/roastLevels.js';
import type { PartialTasteAxes } from '../tasteProfiles/tasteAxesSchema.js';

import { COFFEE_SIGNAL_SOURCES } from './coffeeSignalSources.js';
import type { CoffeeLabelFacts, CoffeeTasteSignal } from './coffeeTasteSignal.js';
import { ALTITUDE_SIGNALS } from './constants/altitudeSignals.js';
import { NOTE_SIGNALS } from './constants/noteSignals.js';
import { ORIGIN_SIGNALS } from './constants/originSignals.js';
import { PROCESS_SIGNALS } from './constants/processSignals.js';
import { ROAST_SIGNALS } from './constants/roastSignals.js';
import { SIGNAL_WEIGHTS } from './constants/signalWeights.js';
import { VARIETY_SIGNALS } from './constants/varietySignals.js';
import { normalizeSignalText } from './normalizeSignalText.js';

type StemTable = readonly (readonly [string, PartialTasteAxes])[];

const isRoastLevel = (value: string): value is RoastLevel =>
  ROAST_LEVEL_VALUES.some((level: RoastLevel): boolean => level === value);

/**
 * The first row whose stem appears in the text.
 *
 * First match rather than every match, because these tables describe one thing
 * each: a coffee has one process and one origin, and a note reading "mliečna
 * čokoláda" is one flavour rather than two. The tables are ordered so the
 * specific rows come before the general ones they contain, which is what makes
 * "anaeróbne natural" an anaerobic lot rather than a plain natural.
 */
const matchStem = (table: StemTable, value: string | null | undefined): PartialTasteAxes | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = normalizeSignalText(value);
  const row = table.find(([stem]: readonly [string, PartialTasteAxes]): boolean =>
    text.includes(stem),
  );

  return row === undefined ? null : row[1];
};

const signal = (
  source: CoffeeTasteSignal['source'],
  axes: PartialTasteAxes | null,
  weight: number,
): readonly CoffeeTasteSignal[] => (axes === null ? [] : [{ source, axes, weight }]);

const readRoast = (roastLevel: string | null | undefined): readonly CoffeeTasteSignal[] =>
  roastLevel === null || roastLevel === undefined || !isRoastLevel(roastLevel)
    ? []
    : signal(
        COFFEE_SIGNAL_SOURCES.roastLevel,
        ROAST_SIGNALS[roastLevel],
        SIGNAL_WEIGHTS.roastLevel,
      );

/** The highest band the coffee clears, so the list is read from the top down. */
const readAltitude = (altitude: number | null | undefined): readonly CoffeeTasteSignal[] => {
  if (altitude === null || altitude === undefined) {
    return [];
  }

  const band = ALTITUDE_SIGNALS.find(
    ([floor]: readonly [number, PartialTasteAxes]): boolean => altitude >= floor,
  );

  return signal(
    COFFEE_SIGNAL_SOURCES.altitude,
    band === undefined ? null : band[1],
    SIGNAL_WEIGHTS.altitude,
  );
};

/**
 * Each printed note read on its own.
 *
 * One signal per note rather than one for all of them, so a bag saying
 * "jahoda, mliečna čokoláda" contributes two readings that then have to agree
 * with each other - which is the honest treatment, because that pair genuinely
 * describes a coffee pulling in two directions. A note the lexicon does not
 * recognise contributes nothing rather than a guess; that is what the model is
 * for.
 */
const readNotes = (
  tastingNotes: readonly string[] | null | undefined,
): readonly CoffeeTasteSignal[] =>
  (tastingNotes ?? []).flatMap((note: string): readonly CoffeeTasteSignal[] =>
    signal(
      COFFEE_SIGNAL_SOURCES.tastingNotes,
      matchStem(NOTE_SIGNALS, note),
      SIGNAL_WEIGHTS.tastingNotes,
    ),
  );

/**
 * Everything the label says about how this coffee will taste.
 *
 * Deterministic, offline, and complete on its own: a bag with nothing but a
 * country still produces an answer, and a bag with a full label produces a
 * good one without a model being asked anything. That is the point rather than
 * a fallback - most of what is knowable about a coffee is printed on it, and a
 * feature that only worked where there was signal and allowance left would be
 * missing in a shop, which is the one place it is needed.
 */
export const readCoffeeSignals = (coffee: CoffeeLabelFacts): readonly CoffeeTasteSignal[] => [
  ...readRoast(coffee.roastLevel),
  ...signal(
    COFFEE_SIGNAL_SOURCES.process,
    matchStem(PROCESS_SIGNALS, coffee.process),
    SIGNAL_WEIGHTS.process,
  ),
  ...signal(
    COFFEE_SIGNAL_SOURCES.origin,
    matchStem(ORIGIN_SIGNALS, coffee.originCountry),
    SIGNAL_WEIGHTS.origin,
  ),
  ...signal(
    COFFEE_SIGNAL_SOURCES.variety,
    matchStem(VARIETY_SIGNALS, coffee.variety),
    SIGNAL_WEIGHTS.variety,
  ),
  ...readAltitude(coffee.altitude),
  ...readNotes(coffee.tastingNotes),
];
