import {
  GRINDER_TYPICAL_USES,
  GRINDER_UNIT_TYPES,
  type GrinderTypicalUse,
  type GrinderUnitType,
} from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { GRINDER_PRECISIONS, type GrinderPrecision } from '../services/grinderPrecision';

/** What the collar counts in, as a person reads it. */
export const GRINDER_UNIT_LABEL_KEYS: Record<GrinderUnitType, TranslationKey> = {
  [GRINDER_UNIT_TYPES.clicks]: TRANSLATION_KEYS.grinderUnitClicks,
  [GRINDER_UNIT_TYPES.numbers]: TRANSLATION_KEYS.grinderUnitNumbers,
  [GRINDER_UNIT_TYPES.microns]: TRANSLATION_KEYS.grinderUnitMicrons,
};

export const GRINDER_USE_LABEL_KEYS: Record<GrinderTypicalUse, TranslationKey> = {
  [GRINDER_TYPICAL_USES.espresso]: TRANSLATION_KEYS.grinderFilterEspresso,
  [GRINDER_TYPICAL_USES.filter]: TRANSLATION_KEYS.grinderFilterFilter,
  [GRINDER_TYPICAL_USES.both]: TRANSLATION_KEYS.grinderFilterBoth,
};

/** The sentence that keeps an estimate from reading like a measurement. */
export const GRINDER_PRECISION_LABEL_KEYS: Record<GrinderPrecision, TranslationKey> = {
  [GRINDER_PRECISIONS.measured]: TRANSLATION_KEYS.grinderPrecisionMeasured,
  [GRINDER_PRECISIONS.estimated]: TRANSLATION_KEYS.grinderPrecisionEstimated,
  [GRINDER_PRECISIONS.missing]: TRANSLATION_KEYS.grinderPrecisionMissing,
};

/** Left to right, the order the filter chips are offered in. */
export const GRINDER_USE_FILTER_ORDER = [
  GRINDER_TYPICAL_USES.espresso,
  GRINDER_TYPICAL_USES.filter,
  GRINDER_TYPICAL_USES.both,
] as const;

export const GRINDER_UNIT_TYPE_ORDER = [
  GRINDER_UNIT_TYPES.clicks,
  GRINDER_UNIT_TYPES.numbers,
  GRINDER_UNIT_TYPES.microns,
] as const;
