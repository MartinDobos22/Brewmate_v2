import {
  CONVERSION_FIELD_NAMES,
  CONVERSION_PRECISIONS,
  CONVERSION_REASONS,
  type ConversionField,
  type ConversionPrecision,
  type ConversionReason,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

const [GRIND, DOSE, WATER, RATIO, TEMPERATURE, SCHEDULE, TIME] = CONVERSION_FIELD_NAMES;

/**
 * Every machine name the conversion can produce, in Slovak.
 *
 * Total maps rather than lookups with a fallback, and that is the point:
 * adding a step to the conversion algorithm becomes a type error right here,
 * at the one place that has to explain it to somebody, instead of an
 * untranslated English identifier on a recipe card.
 *
 * The conversion module writes no Slovak at all - it decides what happened and
 * this decides how to say it. That seam is what lets the arithmetic be
 * replaced later without touching a single sentence.
 */
export const CONVERSION_FIELD_KEYS: Record<ConversionField, TranslationKey> = {
  [GRIND]: TRANSLATION_KEYS.conversionFieldGrind,
  [DOSE]: TRANSLATION_KEYS.conversionFieldDose,
  [WATER]: TRANSLATION_KEYS.conversionFieldWater,
  [RATIO]: TRANSLATION_KEYS.conversionFieldRatio,
  [TEMPERATURE]: TRANSLATION_KEYS.conversionFieldTemperature,
  [SCHEDULE]: TRANSLATION_KEYS.conversionFieldSchedule,
  [TIME]: TRANSLATION_KEYS.conversionFieldTime,
};

export const CONVERSION_PRECISION_KEYS: Record<ConversionPrecision, TranslationKey> = {
  [CONVERSION_PRECISIONS.exact]: TRANSLATION_KEYS.conversionPrecisionExact,
  [CONVERSION_PRECISIONS.estimated]: TRANSLATION_KEYS.conversionPrecisionEstimated,
  [CONVERSION_PRECISIONS.unknown]: TRANSLATION_KEYS.conversionPrecisionUnknown,
};

export const CONVERSION_REASON_KEYS: Record<ConversionReason, TranslationKey> = {
  [CONVERSION_REASONS.fromStatedMicrons]: TRANSLATION_KEYS.conversionReasonFromStatedMicrons,
  [CONVERSION_REASONS.fromBothCalibrations]: TRANSLATION_KEYS.conversionReasonFromBothCalibrations,
  [CONVERSION_REASONS.fromGrindWords]: TRANSLATION_KEYS.conversionReasonFromGrindWords,
  [CONVERSION_REASONS.fromMethodCategory]: TRANSLATION_KEYS.conversionReasonFromMethodCategory,
  [CONVERSION_REASONS.calibrationEstimated]: TRANSLATION_KEYS.conversionReasonCalibrationEstimated,
  [CONVERSION_REASONS.grinderUnverified]: TRANSLATION_KEYS.conversionReasonGrinderUnverified,
  [CONVERSION_REASONS.outsideCalibratedRange]:
    TRANSLATION_KEYS.conversionReasonOutsideCalibratedRange,
  [CONVERSION_REASONS.targetGrinderUncalibrated]:
    TRANSLATION_KEYS.conversionReasonTargetGrinderUncalibrated,
  [CONVERSION_REASONS.grindNotAdjustable]: TRANSLATION_KEYS.conversionReasonGrindNotAdjustable,
  [CONVERSION_REASONS.keptFromSource]: TRANSLATION_KEYS.conversionReasonKeptFromSource,
  [CONVERSION_REASONS.ratioPreserved]: TRANSLATION_KEYS.conversionReasonRatioPreserved,
  [CONVERSION_REASONS.scaledToCapacity]: TRANSLATION_KEYS.conversionReasonScaledToCapacity,
  [CONVERSION_REASONS.scaledToDoseWindow]: TRANSLATION_KEYS.conversionReasonScaledToDoseWindow,
  [CONVERSION_REASONS.clampedToMethodWindow]:
    TRANSLATION_KEYS.conversionReasonClampedToMethodWindow,
  [CONVERSION_REASONS.scaledWithWater]: TRANSLATION_KEYS.conversionReasonScaledWithWater,
  [CONVERSION_REASONS.differentMethodCategory]:
    TRANSLATION_KEYS.conversionReasonDifferentMethodCategory,
  [CONVERSION_REASONS.noTemperatureControl]: TRANSLATION_KEYS.conversionReasonNoTemperatureControl,
  [CONVERSION_REASONS.notStatedInSource]: TRANSLATION_KEYS.conversionReasonNotStatedInSource,
};
