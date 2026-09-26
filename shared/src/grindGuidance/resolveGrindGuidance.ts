import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';
import { describeMicrons } from '../conversion/grindDescriptorMicrons.js';
import { GRIND_MICRON_WINDOWS, middleOfWindow } from '../conversion/grindMicronWindows.js';
import type { GrindDescriptor } from '../conversion/grindDescriptors.js';
import {
  micronsToSetting,
  settingToMicrons,
  snapToStep,
} from '../conversion/interpolateMicrons.js';
import type { MicronWindow } from '../conversion/micronWindowSchema.js';
import type { Grinder } from '../grinders/grinderSchema.js';

import {
  GUIDANCE_BAND_FRACTION,
  HABIT_SHIFT_LIMIT,
  GUIDANCE_MICRON_DECIMALS,
  GUIDANCE_SETTING_DECIMALS,
  SLOPE_MIN_SETTING_SPAN,
  STEPLESS_ADVICE_UNIT,
  TASTE_STEP_FRACTION,
  WINDOW_HALF_WIDTH_FRACTION,
} from './grindGuidanceFieldLimits.js';
import type { GrindCoffeeFacts } from './grindCoffeeFacts.js';
import { GRIND_GUIDANCE_SOURCES, type GrindGuidanceSource } from './grindGuidanceSources.js';
import { GRIND_SHIFT_SOURCES, type GrindShift } from './grindShiftSources.js';
import { readBeanGrindShift } from './readBeanGrindShift.js';
import { readPublishedRange } from './readPublishedRange.js';
import { sumBeanGrindShift } from './sumBeanGrindShift.js';

const NOTHING = 0;
const ROUNDING_BASE = 10;

const round = (value: number, decimals: number): number => {
  const factor = ROUNDING_BASE ** decimals;

  return Math.round(value * factor) / factor;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** A place to start and the range the right answer is almost certainly inside. */
export interface GrindBand {
  readonly target: number;
  readonly min: number;
  readonly max: number;
}

/** How far to move this particular collar to change the cup by one taste. */
export interface GrindStepAdvice {
  /** What one unit of this collar is worth, in microns. */
  readonly micronsPerSetting: number;
  /** How many units of the collar one adjustment should move, never below one step. */
  readonly settings: number;
}

/**
 * Where to put the collar before the first cup, and what to do to it after.
 *
 * `setting` and `step` are null together: both are read off the same curve,
 * and a grinder with no curve in the catalogue can be given a grind in words
 * and nothing more. That is a normal outcome rather than a failure, and the
 * descriptor is always present for exactly that reason.
 */
export interface GrindGuidance {
  readonly microns: GrindBand;
  readonly descriptor: GrindDescriptor;
  readonly setting: GrindBand | null;
  readonly step: GrindStepAdvice | null;
  /** Why the starting point is not the middle of the window. Empty when nothing was known. */
  readonly shifts: readonly GrindShift[];
  /** Whether the band is this grinder's own published range or the family window. */
  readonly source: GrindGuidanceSource;
  /** Whether the numbers rest on a curve nobody measured or an entry nobody checked. */
  readonly isCollarEstimated: boolean;
}

export interface GrindGuidanceRequest {
  readonly methodCategory: BrewMethodCategory;
  readonly coffee: GrindCoffeeFacts;
  readonly grinder: Grinder | null;
  /**
   * Where this person's own cups in this family of brewer have settled, past
   * what their bags alone explain - the brewing profile's reading, in the same
   * units as every other shift here.
   *
   * Absent or null for somebody who has not brewed enough to have a habit,
   * which is everybody on their first morning and the ordinary case.
   */
  readonly habitShift?: number | null;
}

/**
 * The habit as one more reason, or no reason at all.
 *
 * Reported beside the bag's facts rather than folded into them, because a
 * starting point that moved because of somebody's own history has to say so:
 * "finer, because that is where your cups end up" is the sentence that lets
 * somebody disagree with the habit rather than with the arithmetic.
 */
const readHabit = (habitShift: number | null): readonly GrindShift[] =>
  habitShift === null || habitShift === NOTHING
    ? []
    : [
        {
          source: GRIND_SHIFT_SOURCES.brewingHabit,
          amount: clamp(habitShift, -HABIT_SHIFT_LIMIT, HABIT_SHIFT_LIMIT),
        },
      ];

/** The band in microns, before any grinder has been consulted. */
const resolveMicronBand = (window: MicronWindow, shift: number): GrindBand => {
  const halfWidth = (window.max - window.min) * WINDOW_HALF_WIDTH_FRACTION;
  const target = clamp(middleOfWindow(window) + shift * halfWidth, window.min, window.max);
  const bandHalf = halfWidth * GUIDANCE_BAND_FRACTION;

  return {
    target: round(target, GUIDANCE_MICRON_DECIMALS),
    min: round(clamp(target - bandHalf, window.min, window.max), GUIDANCE_MICRON_DECIMALS),
    max: round(clamp(target + bandHalf, window.min, window.max), GUIDANCE_MICRON_DECIMALS),
  };
};

/**
 * The same band, read off this grinder's collar.
 *
 * The ends are sorted rather than assigned, because a collar is not obliged to
 * count upwards towards coarse: several popular grinders are marked the other
 * way round, and a band whose `min` was simply "the finer end" would print
 * backwards on every one of them.
 *
 * An end the curve cannot reach falls back to the target rather than voiding
 * the whole answer. A published curve describes the range somebody measured,
 * and a light roast for espresso often sits below the finest point on it - the
 * collar still bottoms out somewhere, and "start here, and this is as far down
 * as the curve goes" is a usable instruction where silence is not.
 */
const readBand = (grinder: Grinder, microns: GrindBand): GrindBand | null => {
  const bounds = { min: grinder.minSetting, max: grinder.maxSetting };
  const at = (value: number): number | null =>
    micronsToSetting(grinder.micronCalibration, value, bounds)?.value ?? null;
  const target = at(microns.target);

  if (target === null) {
    return null;
  }

  const low = at(microns.min) ?? target;
  const high = at(microns.max) ?? target;
  const snap = (value: number): number => snapToStep(value, grinder.step, grinder.minSetting);

  return {
    target: snap(target),
    min: snap(Math.min(low, high)),
    max: snap(Math.max(low, high)),
  };
};

/** The smallest move this collar admits: its own step, or one unit when stepless. */
const unitOf = (grinder: Grinder): number =>
  grinder.step <= NOTHING ? STEPLESS_ADVICE_UNIT : grinder.step;

/**
 * What one unit of this collar is worth in microns, around the setting being
 * recommended.
 *
 * A local slope rather than an average over the whole curve, because that is
 * the stretch of the collar the person is about to be turning: most grinders
 * change far faster per click at the coarse end than at the espresso end, and
 * a single figure for the whole range would be wrong at both.
 */
const readSlope = (grinder: Grinder, at: number): number | null => {
  const unit = unitOf(grinder);
  const lowSetting = Math.max(at - unit, grinder.minSetting);
  const highSetting = Math.min(at + unit, grinder.maxSetting);
  const span = highSetting - lowSetting;

  if (span < SLOPE_MIN_SETTING_SPAN) {
    return null;
  }

  const low = settingToMicrons(grinder.micronCalibration, lowSetting);
  const high = settingToMicrons(grinder.micronCalibration, highSetting);

  if (low === null || high === null) {
    return null;
  }

  return Math.abs(high.value - low.value) / span;
};

/**
 * The band this grinder's own publisher gives for this family of brewer.
 *
 * Preferred over the micron round trip wherever it exists, and that preference
 * is the whole reason the field is stored. Going through microns means going
 * through a window drawn for a whole family of brewer; measured against the
 * published ranges it was supposed to reproduce, that round trip landed about
 * a third of a method's range too coarse, reliably and in one direction, on
 * every grinder it was checked against. A published range is what somebody
 * says about this exact model, and it needs no round trip at all.
 *
 * The bean still decides where inside the range to stand, exactly as it does
 * inside a micron window - the range is the range, not the answer.
 */
const readPublishedBand = (
  grinder: Grinder,
  category: BrewMethodCategory,
  shift: number,
): GrindBand | null => {
  const range = readPublishedRange(grinder, category);

  if (range === null) {
    return null;
  }

  const halfRange = (range.max - range.min) * WINDOW_HALF_WIDTH_FRACTION;
  const middle = (range.min + range.max) * WINDOW_HALF_WIDTH_FRACTION;
  const snap = (value: number): number => snapToStep(value, grinder.step, grinder.minSetting);

  return {
    target: snap(clamp(middle + shift * halfRange, range.min, range.max)),
    min: snap(range.min),
    max: snap(range.max),
  };
};

/**
 * What that band works out to in microns, so the word attached to it and the
 * number on the collar are describing the same coffee.
 *
 * Null where the grinder has no curve, which is a normal outcome: a published
 * range is perfectly usable on its own, and the descriptor then comes from the
 * method's window instead.
 */
const readMicronsFor = (grinder: Grinder, band: GrindBand): GrindBand | null => {
  const at = (setting: number): number | null =>
    settingToMicrons(grinder.micronCalibration, setting)?.value ?? null;
  const target = at(band.target);
  const low = at(band.min);
  const high = at(band.max);

  if (target === null || low === null || high === null) {
    return null;
  }

  return { target, min: Math.min(low, high), max: Math.max(low, high) };
};

/**
 * How far to turn this collar for one change somebody can actually taste.
 *
 * Rounded to whole steps of the collar and never below one, because half a
 * click is not an instruction. This is the number a cafe dialling in a new bag
 * is paying for: "o dva kliky jemnejsie" spends one dose, where "a little
 * finer" spends however many it takes to find out what little meant.
 *
 * Too small a move and the next cup tastes the same, so a dose was spent and
 * nothing was learned; too large and it overshoots into the opposite fault.
 * `TASTE_STEP_FRACTION` of the brewing family's own window is roughly the
 * smallest change that reliably reads as different.
 */
const readStep = (
  grinder: Grinder,
  window: MicronWindow,
  setting: GrindBand,
): GrindStepAdvice | null => {
  const micronsPerSetting = readSlope(grinder, setting.target);

  if (micronsPerSetting === null || micronsPerSetting <= NOTHING) {
    return null;
  }

  const unit = unitOf(grinder);
  const wanted = ((window.max - window.min) * TASTE_STEP_FRACTION) / micronsPerSetting;

  return {
    micronsPerSetting: round(micronsPerSetting, GUIDANCE_SETTING_DECIMALS),
    settings: round(Math.max(unit, Math.round(wanted / unit) * unit), GUIDANCE_SETTING_DECIMALS),
  };
};

/**
 * Where to start grinding this coffee, in this brewer, on this grinder.
 *
 * Deterministic, offline, and free. Nothing here asks a model anything, which
 * is the point rather than an optimisation: a starting point is needed before
 * the first cup of every new bag, several times a morning in a cafe, and a
 * feature that cost a request and a second of waiting would be a feature
 * people stopped using by the third bag.
 *
 * The method's window decides the ballpark, the bag decides where in that
 * window to stand, and the grinder's own curve turns the answer into a number
 * on the collar in front of somebody. Each of the three can be missing. With
 * no bag facts the answer is the middle of the window, reported with an empty
 * list of reasons rather than dressed up as a reading of a coffee. With no
 * calibrated grinder there is no number at all, only the word - which is what
 * an honest app says rather than inventing a scale to print a number on.
 *
 * Somebody who has brewed enough cups also brings a habit: where their own
 * settings have ended up, past what their bags explained. It moves the start
 * inside the same window the bag does, under its own cap, and is reported as
 * its own reason - it is the one part of this answer that is learned rather
 * than looked up, and the one most worth being able to disagree with.
 *
 * What this is not is a claim to be right. Burr alignment, bean density, how
 * the last person left the collar and the age of the burrs all move a real
 * grind further than this arithmetic does. It is the difference between
 * starting two clicks out and starting ten, which over a new bag is two shots
 * instead of six.
 */
export const resolveGrindGuidance = ({
  methodCategory,
  coffee,
  grinder,
  habitShift,
}: GrindGuidanceRequest): GrindGuidance => {
  const window = GRIND_MICRON_WINDOWS[methodCategory];
  const beanShifts = readBeanGrindShift(coffee);
  const habit = readHabit(habitShift ?? null);
  const shifts = [...beanShifts, ...habit];
  const shift =
    sumBeanGrindShift(beanShifts) +
    habit.reduce((sum: number, entry: GrindShift): number => sum + entry.amount, NOTHING);
  const fromWindow = resolveMicronBand(window, shift);
  const published = grinder === null ? null : readPublishedBand(grinder, methodCategory, shift);
  const setting = published ?? (grinder === null ? null : readBand(grinder, fromWindow));
  const microns =
    published === null || grinder === null
      ? fromWindow
      : (readMicronsFor(grinder, published) ?? fromWindow);

  return {
    microns,
    descriptor: describeMicrons(microns.target),
    setting,
    step: grinder === null || setting === null ? null : readStep(grinder, window, setting),
    shifts,
    source:
      published === null
        ? GRIND_GUIDANCE_SOURCES.methodWindow
        : GRIND_GUIDANCE_SOURCES.publishedRange,
    isCollarEstimated:
      grinder !== null && (grinder.micronCalibration?.isEstimated === true || !grinder.isVerified),
  };
};
