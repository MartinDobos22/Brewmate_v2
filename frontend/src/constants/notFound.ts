import type { TileGlyph } from '../components/ui';

/**
 * A signpost with the direction taken off it.
 *
 * This route exists only when somebody arrives somewhere the app does not
 * have, which is a place rather than a mistake - so the mark is a missing
 * destination and not a warning. A cross or a triangle here would tell the
 * reader they did something wrong, and a broken link in a notification is not
 * something they did.
 */
export const NOT_FOUND_ICON = 'sign-direction-remove' satisfies TileGlyph;
