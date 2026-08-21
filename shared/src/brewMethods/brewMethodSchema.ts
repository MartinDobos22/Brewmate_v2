import { z } from 'zod';

import { BREW_METHOD_CATEGORIES } from '../enums/brewMethodCategories.js';
import { EQUIPMENT_TYPES } from '../enums/equipmentTypes.js';

import {
  BREW_METHOD_KEY_MAX_LENGTH,
  BREW_METHOD_NAME_MAX_LENGTH,
  BREW_METHOD_SORT_ORDER_MIN,
} from './brewMethodFieldLimits.js';
import { ratioRangeSchema } from './ratioRangeSchema.js';

/**
 * A brewing method, as data.
 *
 * Nothing in the application branches on `key`: everything a method needs in
 * order to behave differently is carried by the row itself. Adding V60 Switch
 * is an insert, not a release.
 *
 * Methods are retired with `isActive` rather than deleted, because recipes
 * point at them and history has to keep making sense.
 */
export const brewMethodSchema = z.object({
  id: z.uuid(),
  key: z.string().min(1).max(BREW_METHOD_KEY_MAX_LENGTH),
  nameSk: z.string().min(1).max(BREW_METHOD_NAME_MAX_LENGTH),
  category: z.enum(BREW_METHOD_CATEGORIES),
  defaultRatioRange: ratioRangeSchema,
  requiresEquipmentType: z.enum(EQUIPMENT_TYPES).nullable(),
  sortOrder: z.number().int().min(BREW_METHOD_SORT_ORDER_MIN),
  isActive: z.boolean(),
});

export type BrewMethod = z.infer<typeof brewMethodSchema>;
