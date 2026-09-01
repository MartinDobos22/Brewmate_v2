/**
 * How much a model may say about a coffee it has only seen the label of.
 *
 * The summary is two sentences, so the ceiling is what two long Slovak
 * sentences take and not a paragraph: this is printed on a card next to a
 * shape, and anything longer stops being read.
 */
export const COFFEE_SUMMARY_MAX_LENGTH = 320;

/**
 * The flavours a drinker will actually meet, which is a short list by nature.
 * A coffee described by eight flavours has been described by none.
 */
export const READING_FLAVOUR_NOTES_MAX = 6;
export const READING_FLAVOUR_NOTE_MAX_LENGTH = 48;

/**
 * How far a model's reading is trusted against the printed label.
 *
 * Comparable to the roast level and below the process, deliberately. The model
 * knows things the tables cannot - what a region implies, what an unfamiliar
 * note tastes like - but it is also the one signal here that can be confidently
 * wrong about a bag it has never seen, and a full label that disagrees with it
 * should win. Multiplied by the confidence the model declares, so a reading
 * taken from almost nothing carries almost nothing.
 */
export const MODEL_READING_WEIGHT = 0.9;
