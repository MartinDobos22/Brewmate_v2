/**
 * The chevron on the "Dnes nemám všetko" header.
 *
 * Not decoration, and not copy - it is the whole reason the header reads as
 * something that opens. Without it the section was a title and a grey sentence
 * indistinguishable from the explanatory lines under every other card on this
 * screen, so the most consequential control here - what is ticked changes the
 * shape of the recipe rather than adding a footnote to it - was found by
 * accident or not at all.
 */
export const CONSTRAINTS_ICONS = {
  collapsed: 'chevron-down',
  expanded: 'chevron-up',
} as const;
