import { EQUIPMENT_TYPES, WATER_TYPES } from '@brewmate/shared';
import type { BrewParams, CreateEquipmentRequest } from '@brewmate/shared';

const DOSE_GRAMS = 18;
const WATER_GRAMS = 300;
const RATIO = 16.6;
const GRIND_SETTING = 22;
const WATER_TEMP_C = 94;

/** A complete, valid set of brew parameters. */
export const TEST_BREW_PARAMS: BrewParams = {
  doseGrams: DOSE_GRAMS,
  waterGrams: WATER_GRAMS,
  ratio: RATIO,
  grindSetting: GRIND_SETTING,
  waterTempC: WATER_TEMP_C,
  waterType: WATER_TYPES.filtered,
  steps: [],
};

export const TEST_GRINDER_EQUIPMENT: CreateEquipmentRequest = {
  type: EQUIPMENT_TYPES.grinder,
  brand: 'Comandante',
  model: 'C40',
};

export const TEST_KETTLE_EQUIPMENT: CreateEquipmentRequest = {
  type: EQUIPMENT_TYPES.kettle,
  brand: 'Fellow',
  model: 'Stagg EKG',
};

export const TEST_BAG_NAME = 'Kiamugumo AA';
export const OTHER_BAG_NAME = 'Finca La Esperanza';
export const TEST_SET_NAME = 'Domov';
export const OTHER_SET_NAME = 'Chata';
