import { BREW_METHOD_CATEGORIES, EQUIPMENT_TYPES } from '@brewmate/shared';

import type { NewBrewMethodRow } from '../../schema/brewMethodsTable.js';

/** A catalogue entry as written down here; the id is the database's business. */
export type BrewMethodSeed = Omit<NewBrewMethodRow, 'id'>;

/**
 * The brewing methods Brewmate ships with.
 *
 * Adding one here is the *whole* change: no branch, no enum, no release note.
 * `key` is the stable identity a recipe points at, so it is never renamed;
 * `nameSk` is what a person reads and may be reworded any time.
 *
 * `defaultRatioRange` is parts of water per part of coffee - the window a
 * method is usually brewed in, not a rule. The espresso entries carry the
 * brew ratio of the shot itself (1:2 to 1:3), which is why their numbers look
 * nothing like a filter recipe's.
 *
 * `sortOrder` leaves gaps of ten so a method can be slotted between two others
 * without renumbering the catalogue.
 */
export const BREW_METHOD_SEEDS: readonly BrewMethodSeed[] = [
  {
    key: 'v60',
    nameSk: 'Hario V60',
    category: BREW_METHOD_CATEGORIES.pourOver,
    defaultRatioRange: { min: 15, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 10,
  },
  {
    key: 'chemex',
    nameSk: 'Chemex',
    category: BREW_METHOD_CATEGORIES.pourOver,
    defaultRatioRange: { min: 15, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 20,
  },
  {
    key: 'kalita-wave',
    nameSk: 'Kalita Wave',
    category: BREW_METHOD_CATEGORIES.pourOver,
    defaultRatioRange: { min: 15, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 30,
  },
  {
    key: 'origami',
    nameSk: 'Origami dripper',
    category: BREW_METHOD_CATEGORIES.pourOver,
    defaultRatioRange: { min: 15, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 40,
  },
  {
    /** A dripper with a valve: brewed as a pour over, closed for immersion. */
    key: 'switch',
    nameSk: 'Hario Switch',
    category: BREW_METHOD_CATEGORIES.pourOver,
    defaultRatioRange: { min: 14, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 50,
  },
  {
    key: 'december-dripper',
    nameSk: 'December Dripper',
    category: BREW_METHOD_CATEGORIES.pourOver,
    defaultRatioRange: { min: 15, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 60,
  },

  {
    key: 'french-press',
    nameSk: 'French press',
    category: BREW_METHOD_CATEGORIES.immersion,
    defaultRatioRange: { min: 14, max: 18 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 70,
  },
  {
    key: 'aeropress',
    nameSk: 'AeroPress',
    category: BREW_METHOD_CATEGORIES.immersion,
    defaultRatioRange: { min: 12, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 80,
  },
  {
    key: 'clever-dripper',
    nameSk: 'Clever Dripper',
    category: BREW_METHOD_CATEGORIES.immersion,
    defaultRatioRange: { min: 15, max: 17 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 90,
  },
  {
    /** A cup and a spoon; the one method that needs no brewer at all. */
    key: 'cupping',
    nameSk: 'Cupping (degustácia)',
    category: BREW_METHOD_CATEGORIES.immersion,
    defaultRatioRange: { min: 17, max: 19 },
    requiresEquipmentType: null,
    sortOrder: 100,
  },

  {
    key: 'espresso-lever',
    nameSk: 'Espresso – pákový kávovar',
    category: BREW_METHOD_CATEGORIES.espresso,
    defaultRatioRange: { min: 1.5, max: 3 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 110,
  },
  {
    key: 'espresso-automatic',
    nameSk: 'Espresso – plnoautomat',
    category: BREW_METHOD_CATEGORIES.espresso,
    defaultRatioRange: { min: 1.5, max: 3 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 120,
  },

  {
    /** The wide window is the concentrate-or-drink decision, not imprecision. */
    key: 'cold-brew',
    nameSk: 'Cold brew (lúhovaný)',
    category: BREW_METHOD_CATEGORIES.cold,
    defaultRatioRange: { min: 8, max: 16 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 130,
  },
  {
    key: 'cold-drip',
    nameSk: 'Cold drip (kvapkaný)',
    category: BREW_METHOD_CATEGORIES.cold,
    defaultRatioRange: { min: 8, max: 12 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 140,
  },

  {
    key: 'moka-pot',
    nameSk: 'Moka kanvica',
    category: BREW_METHOD_CATEGORIES.stovetop,
    defaultRatioRange: { min: 7, max: 10 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 150,
  },
  {
    key: 'ibrik',
    nameSk: 'Turek (ibrik)',
    category: BREW_METHOD_CATEGORIES.stovetop,
    defaultRatioRange: { min: 8, max: 12 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 160,
  },
  {
    key: 'siphon',
    nameSk: 'Sifón (siphon)',
    category: BREW_METHOD_CATEGORIES.stovetop,
    defaultRatioRange: { min: 14, max: 16 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 170,
  },

  {
    key: 'batch-brew',
    nameSk: 'Prekvapkávač (batch brewer)',
    category: BREW_METHOD_CATEGORIES.batch,
    defaultRatioRange: { min: 15, max: 18 },
    requiresEquipmentType: EQUIPMENT_TYPES.brewer,
    sortOrder: 180,
  },
];
