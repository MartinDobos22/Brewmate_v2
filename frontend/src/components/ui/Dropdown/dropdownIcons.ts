/**
 * The two glyphs a dropdown draws. Not copy - they are the same in every
 * language, and they are the whole reason a closed dropdown reads as something
 * that opens rather than as a line of text somebody has already answered.
 */
export const DROPDOWN_ICONS = {
  closed: 'chevron-down',
  chosen: 'check',
} as const;
