import type { Grinder } from '../grinders/grinderSchema.js';

import { CONVERSION_PRECISIONS } from './conversionPrecision.js';
import { CONVERSION_REASONS, type ConversionReason } from './conversionReasons.js';
import type { ConversionNote } from './conversionNoteSchema.js';
import { describeMicrons, micronsForDescriptor } from './grindDescriptorMicrons.js';
import { GRIND_MICRON_WINDOWS, middleOfWindow } from './grindMicronWindows.js';
import type { GrindDescriptor } from './grindDescriptors.js';
import { micronsToSetting, settingToMicrons, snapToStep } from './interpolateMicrons.js';
import { readGrindWords } from './readGrindWords.js';
import type { ConversionTarget } from './conversionTarget.js';
import type { SourceRecipe } from './sourceRecipeSchema.js';

const GRIND = 'grind';

/** What the grind came out as, and everything the conversion owes the reader about it. */
export interface ConvertedGrind {
  /** A number on their own collar, or null when their grinder has no curve. */
  readonly setting: number | null;
  /** The particle size both sides were compared through. */
  readonly microns: number | null;
  readonly descriptor: GrindDescriptor | null;
  readonly notes: readonly ConversionNote[];
}

interface SourceGrind {
  readonly microns: number;
  readonly reason: ConversionReason;
  readonly extraNotes: readonly ConversionNote[];
}

const note = (
  precision: ConversionNote['precision'],
  reason: ConversionReason,
): ConversionNote => ({ field: GRIND, precision, reason });

const estimated = (reason: ConversionReason): ConversionNote =>
  note(CONVERSION_PRECISIONS.estimated, reason);

/**
 * What a catalogue entry is worth as evidence.
 *
 * Two separate admissions, because they are two separate doubts. A curve
 * flagged `isEstimated` was read off a manufacturer's sheet rather than
 * measured with a sieve; an entry that is not `isVerified` is one person's
 * contribution rather than part of the catalogue everybody sees. Either one
 * makes the number softer, and the spec is explicit that an unverified
 * calibration has to be said out loud rather than folded into a general
 * hedge.
 */
const doubtsAbout = (grinder: Grinder | null): readonly ConversionNote[] => {
  if (grinder === null) {
    return [];
  }

  return [
    ...(grinder.micronCalibration?.isEstimated === true
      ? [estimated(CONVERSION_REASONS.calibrationEstimated)]
      : []),
    ...(grinder.isVerified ? [] : [estimated(CONVERSION_REASONS.grinderUnverified)]),
  ];
};

/**
 * The particle size the source recipe meant, however it happened to say it.
 *
 * Four ways down, in order of how much each is worth. A stated micron figure
 * is the recipe's own answer. A collar setting is worth having only with the
 * curve for that collar behind it. Words are worth less but are worth
 * something, and are what most recipes actually carry. The method's own window
 * is the floor: it is not evidence about this recipe at all, only about the
 * family of brewer, which is why it is reported as such.
 */
const readSourceGrind = (
  recipe: SourceRecipe,
  sourceGrinder: Grinder | null,
  target: ConversionTarget,
): SourceGrind => {
  if (recipe.grindMicrons !== null) {
    return {
      microns: recipe.grindMicrons,
      reason: CONVERSION_REASONS.fromStatedMicrons,
      extraNotes: [],
    };
  }

  const fromCollar =
    recipe.grindSetting === null
      ? null
      : settingToMicrons(sourceGrinder?.micronCalibration ?? null, recipe.grindSetting);

  if (fromCollar !== null) {
    return {
      microns: fromCollar.value,
      reason: CONVERSION_REASONS.fromBothCalibrations,
      extraNotes: [
        ...doubtsAbout(sourceGrinder),
        ...(fromCollar.isExtrapolated
          ? [estimated(CONVERSION_REASONS.outsideCalibratedRange)]
          : []),
      ],
    };
  }

  const fromWords = readGrindWords(recipe.grindLabel);

  if (fromWords !== null) {
    return {
      microns: micronsForDescriptor(fromWords),
      reason: CONVERSION_REASONS.fromGrindWords,
      extraNotes: [],
    };
  }

  return {
    microns: middleOfWindow(GRIND_MICRON_WINDOWS[recipe.methodCategory ?? target.methodCategory]),
    reason: CONVERSION_REASONS.fromMethodCategory,
    extraNotes: [],
  };
};

/**
 * The same coffee particle size, expressed on this person's own grinder.
 *
 * Everything goes through microns, never through any relationship between the
 * two collars, because there is no such relationship to use: two grinders are
 * comparable only through what they actually produce.
 *
 * The result is never `exact`, whatever the inputs were. Burr alignment, bean
 * density, how the last person left the collar and the age of the burrs all
 * move a real grind further than the difference between two published curves,
 * so a converted grind is a place to start dialling from - and saying anything
 * stronger about it would be the one dishonest number on the card.
 */
export const convertGrind = (
  recipe: SourceRecipe,
  sourceGrinder: Grinder | null,
  target: ConversionTarget,
): ConvertedGrind => {
  if (!target.canAdjustGrind) {
    return {
      setting: null,
      microns: null,
      descriptor: null,
      notes: [note(CONVERSION_PRECISIONS.unknown, CONVERSION_REASONS.grindNotAdjustable)],
    };
  }

  const source = readSourceGrind(recipe, sourceGrinder, target);
  const descriptor = describeMicrons(source.microns);
  const grinder = target.grinder;
  const reading =
    grinder === null
      ? null
      : micronsToSetting(grinder.micronCalibration, source.microns, {
          min: grinder.minSetting,
          max: grinder.maxSetting,
        });

  if (grinder === null || reading === null) {
    return {
      setting: null,
      microns: source.microns,
      descriptor,
      notes: [
        estimated(source.reason),
        ...source.extraNotes,
        estimated(CONVERSION_REASONS.targetGrinderUncalibrated),
      ],
    };
  }

  return {
    setting: snapToStep(reading.value, grinder.step, grinder.minSetting),
    microns: source.microns,
    descriptor,
    notes: [
      estimated(source.reason),
      ...source.extraNotes,
      ...doubtsAbout(grinder),
      ...(reading.isExtrapolated ? [estimated(CONVERSION_REASONS.outsideCalibratedRange)] : []),
    ],
  };
};
