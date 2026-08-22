import type { GrinderRepository } from '../../modules/grinders/grinderRepository.js';

import type { GrinderSeed } from './seedData/grinderSeeds.js';

const VERIFIED = true;

/**
 * Writes the shipped grinders as verified catalogue entries.
 *
 * Matched case-insensitively on brand and model, the same pair the partial
 * unique index covers, so re-running the seed refreshes a calibration curve
 * rather than adding a second Comandante C40.
 */
export const seedGrinders = async (
  repository: GrinderRepository,
  seeds: readonly GrinderSeed[],
): Promise<number> => {
  for (const seed of seeds) {
    const existing = await repository.findVerifiedByModel(seed.brand, seed.model);

    if (existing === null) {
      await repository.create({ ...seed, isVerified: VERIFIED, createdByUserId: null });
    } else {
      await repository.updateById(existing.id, seed);
    }
  }

  return seeds.length;
};
