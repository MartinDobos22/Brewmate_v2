import {
  BREWER_CAPACITY_ML_MAX,
  BREWER_CAPACITY_ML_MIN,
  DOSE_GRAMS_MAX,
  DOSE_GRAMS_MIN,
  ESPRESSO_BASKET_MM_MAX,
  ESPRESSO_BASKET_MM_MIN,
  readBrewerParams,
  type Equipment,
  type JsonObject,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

import { parseSetting } from './grinderFormValues';

const EMPTY = '';

/** The form as it is typed: every measurement is still text, and may be blank. */
export interface BrewerDetailsValues {
  readonly capacityMl: string;
  readonly doseMinGrams: string;
  readonly doseMaxGrams: string;
  readonly basketSizeMm: string;
}

export interface BrewerDetailsErrors {
  readonly capacityMl: TranslationKey | null;
  readonly doseMinGrams: TranslationKey | null;
  readonly doseMaxGrams: TranslationKey | null;
  readonly basketSizeMm: TranslationKey | null;
}

export const NO_BREWER_DETAILS_ERRORS: BrewerDetailsErrors = {
  capacityMl: null,
  doseMinGrams: null,
  doseMaxGrams: null,
  basketSizeMm: null,
};

const write = (value: number | undefined): string => (value === undefined ? EMPTY : String(value));

/** The stored blob, back in the boxes it was typed into. */
export const readBrewerDetailsValues = (brewer: Equipment): BrewerDetailsValues => {
  const params = readBrewerParams(brewer.params);

  return {
    capacityMl: write(params.capacityMl),
    doseMinGrams: write(params.doseMinGrams),
    doseMaxGrams: write(params.doseMaxGrams),
    basketSizeMm: write(params.basketSizeMm),
  };
};

const isBlank = (value: string): boolean => value.trim() === EMPTY;

/** Blank is a valid answer everywhere here: "I do not know" beats a made-up figure. */
const validateOptional = (value: string, min: number, max: number): TranslationKey | null => {
  if (isBlank(value)) {
    return null;
  }

  const parsed = parseSetting(value);

  return Number.isFinite(parsed) && parsed >= min && parsed <= max
    ? null
    : TRANSLATION_KEYS.setupBrewerErrorNumber;
};

const validateDoseRange = (values: BrewerDetailsValues): TranslationKey | null => {
  const named = validateOptional(values.doseMaxGrams, DOSE_GRAMS_MIN, DOSE_GRAMS_MAX);

  if (named !== null || isBlank(values.doseMinGrams) || isBlank(values.doseMaxGrams)) {
    return named;
  }

  return parseSetting(values.doseMinGrams) < parseSetting(values.doseMaxGrams)
    ? null
    : TRANSLATION_KEYS.setupBrewerErrorDoseRange;
};

export const validateBrewerDetails = (values: BrewerDetailsValues): BrewerDetailsErrors => ({
  capacityMl: validateOptional(values.capacityMl, BREWER_CAPACITY_ML_MIN, BREWER_CAPACITY_ML_MAX),
  doseMinGrams: validateOptional(values.doseMinGrams, DOSE_GRAMS_MIN, DOSE_GRAMS_MAX),
  doseMaxGrams: validateDoseRange(values),
  basketSizeMm: validateOptional(
    values.basketSizeMm,
    ESPRESSO_BASKET_MM_MIN,
    ESPRESSO_BASKET_MM_MAX,
  ),
});

export const hasBrewerDetailsError = (errors: BrewerDetailsErrors): boolean =>
  Object.values(errors).some((error: TranslationKey | null): boolean => error !== null);

const put = (key: string, value: string): JsonObject =>
  isBlank(value) ? {} : { [key]: parseSetting(value) };

/**
 * The typed corner of `equipment.params`, rebuilt from the form.
 *
 * A field left blank is left out rather than written as zero: the column is
 * open, and "not recorded" and "zero millilitres" are different facts.
 */
export const toBrewerParams = (values: BrewerDetailsValues, methodId: string): JsonObject => ({
  methodId,
  ...put('capacityMl', values.capacityMl),
  ...put('doseMinGrams', values.doseMinGrams),
  ...put('doseMaxGrams', values.doseMaxGrams),
  ...put('basketSizeMm', values.basketSizeMm),
});
