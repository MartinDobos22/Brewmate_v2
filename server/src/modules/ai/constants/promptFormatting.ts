/**
 * How the facts handed to a model are laid out.
 *
 * A model reads a labelled list far more reliably than a paragraph, and a
 * layout written down here is one that cannot drift between the two prompts
 * that use it.
 */
export const PROMPT_LINE_SEPARATOR = '\n';
export const PROMPT_SECTION_SEPARATOR = '\n\n';
export const PROMPT_LIST_SEPARATOR = ', ';
export const PROMPT_LABEL_SEPARATOR = ': ';
export const PROMPT_BULLET = '- ';

/** Taste axes are reported to one decimal; the second one is noise. */
export const PROMPT_AXIS_DECIMALS = 1;

/**
 * How many earlier verdicts travel with a new one.
 *
 * Enough for the model to stay consistent about a roaster somebody keeps
 * meeting, few enough that a long history does not crowd out the coffee that
 * is actually in somebody's hand.
 */
export const PROMPT_HISTORY_LIMIT = 8;

/** The history is a reminder, not a transcript; each entry gets one line. */
export const PROMPT_HISTORY_TEXT_MAX_LENGTH = 200;
