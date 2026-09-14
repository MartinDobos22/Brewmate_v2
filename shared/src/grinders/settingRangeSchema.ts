import { z } from 'zod';

import { BREW_METHOD_CATEGORIES } from '../enums/brewMethodCategories.js';

import { GRINDER_SETTING_MAX, GRINDER_SETTING_MIN } from './grinderFieldLimits.js';

/** The stretch of a collar one family of brewer is ground on. */
export const settingRangeSchema = z.object({
  min: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
  max: z.number().min(GRINDER_SETTING_MIN).max(GRINDER_SETTING_MAX),
});

export type SettingRange = z.infer<typeof settingRangeSchema>;

/**
 * Where each family of brewer lives on this particular collar, where anybody
 * has published it.
 *
 * This is the most direct evidence the catalogue can carry, and it is kept
 * separate from `micronCalibration` because the two answer different
 * questions. The curve says what a setting *produces*, which is what makes two
 * grinders comparable and what tells somebody how far one click moves the cup.
 * This says what a setting is *for* on this exact model, which is a
 * recommendation somebody published about this grinder rather than an
 * inference through particle size.
 *
 * Keeping both is the point. Deriving the second from the first means going
 * through a micron window drawn for a whole family of brewer, and measuring
 * that round trip against the published ranges it was supposed to reproduce
 * showed it landing a third of a method's range too coarse - reliably, in one
 * direction, on every grinder. Direct evidence beats an inference that can be
 * checked against it and loses.
 *
 * An object with optional keys rather than a partial record, so adding a
 * category to the contract is a type error here instead of a family of brewer
 * that quietly never gets a range.
 */
export const settingRangesSchema = z.object({
  [BREW_METHOD_CATEGORIES.espresso]: settingRangeSchema.optional(),
  [BREW_METHOD_CATEGORIES.pourOver]: settingRangeSchema.optional(),
  [BREW_METHOD_CATEGORIES.immersion]: settingRangeSchema.optional(),
  [BREW_METHOD_CATEGORIES.stovetop]: settingRangeSchema.optional(),
  [BREW_METHOD_CATEGORIES.batch]: settingRangeSchema.optional(),
  [BREW_METHOD_CATEGORIES.cold]: settingRangeSchema.optional(),
});

export type SettingRanges = z.infer<typeof settingRangesSchema>;
