/**
 * The glyphs a dropdown draws. Not copy - they are the same in every
 * language, and they are the whole reason a closed dropdown reads as something
 * that opens rather than as a line of text somebody has already answered.
 */
export const DROPDOWN_ICONS = {
  closed: 'chevron-down',
  chosen: 'check',
  /**
   * The search box inside a sheet, which is always a search box - the
   * dropdown decides whether to draw one at all, and a caller that had to
   * name the glyph as well could name the wrong one.
   */
  search: 'magnify',
} as const;
