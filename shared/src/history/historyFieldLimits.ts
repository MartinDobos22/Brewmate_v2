/**
 * How much of one recipe line a timeline carries.
 *
 * A timeline is read in one request rather than paged, because the thing it
 * exists to show is the shape of the whole line - a dose that crept up over
 * four versions is invisible if the fourth arrives on its own. The ceilings
 * below are what keeps that affordable: a coffee brewed on one method for a
 * year has more versions than anybody reads, and the oldest of them are the
 * ones nobody scrolls to.
 */
export const TIMELINE_VERSIONS_MAX = 40;

/** Notes and cups shown under one version before the rest are counted rather than listed. */
export const TIMELINE_MESSAGES_PER_VERSION_MAX = 20;
export const TIMELINE_BREWS_PER_VERSION_MAX = 20;
