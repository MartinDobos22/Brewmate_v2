import {
  GRINDER_SETTING_MAX,
  GRINDER_SETTING_MIN,
  GRINDER_STEP_MIN,
  type CreateGrinderRequest,
  type GrinderTypicalUse,
  type GrinderUnitType,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/** The form as it is typed: every measurement is still text. */
export interface GrinderFormValues {
  readonly brand: string;
  readonly model: string;
  readonly unitType: GrinderUnitType;
  readonly minSetting: string;
  readonly maxSetting: string;
  readonly step: string;
  readonly typicalUse: GrinderTypicalUse;
}

/** One message per field, or null when the field is fine. */
export interface GrinderFormErrors {
  readonly brand: TranslationKey | null;
  readonly model: TranslationKey | null;
  readonly minSetting: TranslationKey | null;
  readonly maxSetting: TranslationKey | null;
  readonly step: TranslationKey | null;
}

const EMPTY = '';
const DECIMAL_COMMA = ',';
const DECIMAL_POINT = '.';

export const NO_GRINDER_FORM_ERRORS: GrinderFormErrors = {
  brand: null,
  model: null,
  minSetting: null,
  maxSetting: null,
  step: null,
};

/** Slovak keyboards write 2,5; the API only ever reads 2.5. */
export const parseSetting = (value: string): number =>
  Number(value.trim().replace(DECIMAL_COMMA, DECIMAL_POINT));

const isSetting = (value: string): boolean => {
  const parsed = parseSetting(value);

  return (
    value.trim() !== EMPTY &&
    Number.isFinite(parsed) &&
    parsed >= GRINDER_SETTING_MIN &&
    parsed <= GRINDER_SETTING_MAX
  );
};

const validateSetting = (value: string): TranslationKey | null =>
  isSetting(value) ? null : TRANSLATION_KEYS.grinderErrorSettingInvalid;

const validateStep = (value: string): TranslationKey | null => {
  const parsed = parseSetting(value);

  if (value.trim() === EMPTY || !Number.isFinite(parsed)) {
    return TRANSLATION_KEYS.grinderErrorSettingInvalid;
  }

  return parsed < GRINDER_STEP_MIN ? TRANSLATION_KEYS.grinderErrorStepInvalid : null;
};

const validateRange = (values: GrinderFormValues): TranslationKey | null => {
  if (!isSetting(values.maxSetting)) {
    return TRANSLATION_KEYS.grinderErrorSettingInvalid;
  }

  return parseSetting(values.minSetting) < parseSetting(values.maxSetting)
    ? null
    : TRANSLATION_KEYS.grinderErrorRangeInvalid;
};

export const hasGrinderFormError = (errors: GrinderFormErrors): boolean =>
  Object.values(errors).some((error: TranslationKey | null): boolean => error !== null);

/**
 * Checks the form before anything is sent, so a typed comma or a reversed
 * range is answered instantly rather than coming back as a 422.
 */
export const validateGrinderForm = (values: GrinderFormValues): GrinderFormErrors => ({
  brand: values.brand.trim() === EMPTY ? TRANSLATION_KEYS.grinderErrorBrandRequired : null,
  model: values.model.trim() === EMPTY ? TRANSLATION_KEYS.grinderErrorModelRequired : null,
  minSetting: validateSetting(values.minSetting),
  maxSetting: isSetting(values.minSetting)
    ? validateRange(values)
    : validateSetting(values.maxSetting),
  step: validateStep(values.step),
});

/**
 * The contributed entry as the API takes it.
 *
 * No micron calibration is sent: nobody types a curve into a form, and an
 * entry without one is a first-class citizen - the app simply tells the user
 * that conversions for it are less precise.
 */
export const toCreateGrinderRequest = (values: GrinderFormValues): CreateGrinderRequest => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  unitType: values.unitType,
  minSetting: parseSetting(values.minSetting),
  maxSetting: parseSetting(values.maxSetting),
  step: parseSetting(values.step),
  typicalUse: values.typicalUse,
  micronCalibration: null,
});
