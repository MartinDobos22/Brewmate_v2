import { GRINDER_TYPICAL_USES, GRINDER_UNIT_TYPES } from '@brewmate/shared';

import type { GrinderFormValues } from '../services/grinderFormValues';

/**
 * What the add form starts as: a hand grinder counted in clicks, which is what
 * most people who reach this form are holding. Everything numeric is left
 * empty, because an offered number is a number nobody checks.
 */
export const EMPTY_GRINDER_FORM: GrinderFormValues = {
  brand: '',
  model: '',
  unitType: GRINDER_UNIT_TYPES.clicks,
  minSetting: '',
  maxSetting: '',
  step: '',
  typicalUse: GRINDER_TYPICAL_USES.both,
};
