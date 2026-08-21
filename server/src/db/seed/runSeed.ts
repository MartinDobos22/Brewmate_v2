import { createBrewMethodRepository } from '../../modules/brewMethods/brewMethodRepository.js';
import { createGrinderRepository } from '../../modules/grinders/grinderRepository.js';
import type { Database } from '../databaseTypes.js';

import { seedBrewMethods } from './seedBrewMethods.js';
import { seedGrinders } from './seedGrinders.js';
import { BREW_METHOD_SEEDS } from './seedData/brewMethodSeeds.js';
import { GRINDER_SEEDS } from './seedData/grinderSeeds.js';

export interface SeedResult {
  readonly brewMethods: number;
  readonly grinders: number;
}

/**
 * Fills the two catalogues that belong to nobody.
 *
 * Idempotent: every row is matched on its natural key, so this can be run
 * against a fresh branch or an existing one with the same outcome.
 */
export const runSeed = async (db: Database): Promise<SeedResult> => ({
  brewMethods: await seedBrewMethods(createBrewMethodRepository(db), BREW_METHOD_SEEDS),
  grinders: await seedGrinders(createGrinderRepository(db), GRINDER_SEEDS),
});
