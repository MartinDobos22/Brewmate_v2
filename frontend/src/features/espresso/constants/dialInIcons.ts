import type { TileGlyph } from '../../../components/ui';

/**
 * What each of the dial-in's own asides is about.
 *
 * The opening note is an instruction to go and pull a shot rather than a
 * remark about the screen, so it carries the mark of the thing it is asking
 * for. An aside classified by its default information glyph would be the
 * screen talking about itself at the one moment it is talking about coffee.
 */
export const DIAL_IN_ICONS = {
  opening: 'coffee-outline',
} as const satisfies Record<string, TileGlyph>;
