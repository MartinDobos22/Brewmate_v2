import type { BrewMethodCategory } from '../enums/brewMethodCategories.js';
import type { Grinder } from '../grinders/grinderSchema.js';
import type { SettingRange } from '../grinders/settingRangeSchema.js';

/**
 * The range published for this grinder and this family of brewer, where one
 * exists and is usable.
 *
 * A range whose ends coincide or cross says nothing about where inside it to
 * stand, so it is treated as absent. One function, because the guidance that
 * stands inside the range and the reading that measures a brewed setting
 * against it have to be looking at the same range or none at all.
 */
export const readPublishedRange = (
  grinder: Grinder,
  category: BrewMethodCategory,
): SettingRange | null => {
  const range = grinder.settingRanges?.[category];

  return range === undefined || range.max <= range.min ? null : range;
};
