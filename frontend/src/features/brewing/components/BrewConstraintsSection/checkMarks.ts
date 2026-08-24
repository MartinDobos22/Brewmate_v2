/**
 * The two states of a checkbox, as characters rather than icons.
 *
 * A glyph and an empty string rather than two glyphs: an unticked box is drawn
 * by its border, and putting a symbol inside it makes "off" look like a choice
 * somebody made rather than the default.
 */
export const CHECK_MARKS = {
  checked: '✓',
  unchecked: '',
} as const;
