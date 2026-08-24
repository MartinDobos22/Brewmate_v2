/**
 * How far back the report looks.
 *
 * A ceiling rather than the whole history, because what this screen answers is
 * "what have I been drinking", and a bag somebody worked through two years ago
 * is not an answer to that. Five hundred cups is well beyond what anybody
 * brews in a year of daily coffee, so in practice this only ever bites on an
 * account that has been going long enough for the oldest of them to have
 * stopped being true.
 */
export const INSIGHT_HISTORY_LIMIT = 500;

/**
 * How many pinned recipes are read alongside it.
 *
 * A pinned recipe is the strongest thing this product records short of
 * somebody saying so: it is a version they went back to. There are far fewer
 * of these than brews - one per (bag, method) pair at most - so the ceiling is
 * generous and never reached in practice.
 */
export const INSIGHT_PINNED_LIMIT = 200;

/**
 * What it takes for a tasting note to be worth proposing.
 *
 * Notes are the roaster's words, printed on a bag somebody bought, so a note
 * that shows up on one bag says something about that roaster's copywriting
 * rather than about the drinker. Three bags is where a pattern starts.
 */
export const NOTE_MIN_BAGS = 3;

/** How many flavour notes one suggestion may propose at once. */
export const SUGGESTION_NOTES_MAX = 3;

/** Nothing to divide by: an account with no brews has no shares. */
export const NO_EVIDENCE = 0;
export const NO_BREWS = 0;
