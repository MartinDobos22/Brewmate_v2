import type { NewGrinderRow } from '../../../schema/grindersCatalogTable.js';

/**
 * A catalogue entry as written down here.
 *
 * Seeded grinders belong to nobody and are part of the catalogue everybody
 * sees, so neither flag is written by hand. `isVerified` says the *entry* is
 * ours rather than a user's guess at a model name - it says nothing about how
 * accurate a micron curve is, which is what `micronCalibration.isEstimated`
 * is for.
 */
export type GrinderSeed = Omit<
  NewGrinderRow,
  'id' | 'isVerified' | 'createdByUserId' | 'createdAt'
>;
