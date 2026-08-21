import {
  BREW_METHOD_CATEGORY_VALUES,
  CHAT_ROLE_VALUES,
  EQUIPMENT_TYPE_VALUES,
  GRINDER_TYPICAL_USE_VALUES,
  GRINDER_UNIT_TYPE_VALUES,
  MILK_USAGE_VALUES,
  RECIPE_SOURCE_VALUES,
  ROAST_LEVEL_VALUES,
  TASTE_PROFILE_SOURCE_VALUES,
  WATER_TYPE_VALUES,
} from '@brewmate/shared';
import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * The database enums, built from the shared value lists so a column can never
 * accept something the contract rejects, or reject something it allows.
 *
 * These are the closed sets the application actually branches on. Anything
 * only a human reads - a coffee's process, a variety - is text, because that
 * vocabulary belongs to the world rather than to the code.
 */
export const waterTypeEnum = pgEnum('water_type', WATER_TYPE_VALUES);
export const brewMethodCategoryEnum = pgEnum('brew_method_category', BREW_METHOD_CATEGORY_VALUES);
export const equipmentTypeEnum = pgEnum('equipment_type', EQUIPMENT_TYPE_VALUES);
export const grinderUnitTypeEnum = pgEnum('grinder_unit_type', GRINDER_UNIT_TYPE_VALUES);
export const grinderTypicalUseEnum = pgEnum('grinder_typical_use', GRINDER_TYPICAL_USE_VALUES);

/** Also used, nullable, as a taste profile's roast preference. */
export const roastLevelEnum = pgEnum('roast_level', ROAST_LEVEL_VALUES);
export const milkUsageEnum = pgEnum('milk_usage', MILK_USAGE_VALUES);
export const tasteProfileSourceEnum = pgEnum('taste_profile_source', TASTE_PROFILE_SOURCE_VALUES);
export const recipeSourceEnum = pgEnum('recipe_source', RECIPE_SOURCE_VALUES);
export const chatRoleEnum = pgEnum('chat_role', CHAT_ROLE_VALUES);
