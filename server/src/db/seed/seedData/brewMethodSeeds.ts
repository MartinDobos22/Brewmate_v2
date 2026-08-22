import type { NewBrewMethodRow } from '../../schema/brewMethodsTable.js';

/** A catalogue entry as written down here; the id is the database's business. */
export type BrewMethodSeed = Omit<NewBrewMethodRow, 'id'>;

/**
 * The brewing methods Brewmate ships with.
 *
 * Deliberately empty for now - the catalogue itself arrives with the brewing
 * work. What matters is that adding one here is the *whole* change: no branch,
 * no enum, no release note.
 */
export const BREW_METHOD_SEEDS: readonly BrewMethodSeed[] = [];
