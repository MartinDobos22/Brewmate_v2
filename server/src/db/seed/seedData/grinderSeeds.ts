import type { NewGrinderRow } from '../../schema/grindersCatalogTable.js';

/**
 * A catalogue entry as written down here.
 *
 * Seeded grinders are verified by definition and belong to nobody, so neither
 * flag is written by hand.
 */
export type GrinderSeed = Omit<NewGrinderRow, 'id' | 'isVerified' | 'createdByUserId' | 'createdAt'>;

/**
 * The grinders Brewmate ships with.
 *
 * Deliberately empty for now - the catalogue arrives with the brewing work.
 * Users can already contribute their own through `POST /grinders`; those stay
 * unverified and visible only to whoever added them.
 */
export const GRINDER_SEEDS: readonly GrinderSeed[] = [];
