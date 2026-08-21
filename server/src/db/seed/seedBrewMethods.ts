import type { BrewMethodRepository } from '../../modules/brewMethods/brewMethodRepository.js';

import type { BrewMethodSeed } from './seedData/brewMethodSeeds.js';

/**
 * Writes the shipped methods.
 *
 * Keyed on `key`, which is why that column is unique: running the seed twice
 * updates the same rows instead of duplicating the catalogue, and a recipe
 * pointing at a method keeps pointing at it.
 */
export const seedBrewMethods = async (
  repository: BrewMethodRepository,
  seeds: readonly BrewMethodSeed[],
): Promise<number> => {
  for (const seed of seeds) {
    await repository.upsertByKey(seed);
  }

  return seeds.length;
};
