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
 * Below every signal printed about this specific lot - the roast level, the
 * process and the roaster's own tasting notes - and above every generalisation
 * about a population - the origin, the variety and the altitude. That ordering
 * is the whole rule, and it falls out of what this signal is: the model is
 * reading the same label the tables read, so where it disagrees with what is
 * printed, the print wins. What it has that no table here does is everything
 * around the print - what a region implies, what an unfamiliar note tastes
 * like, what a label in a language the lexicon does not cover says - which is
 * worth more than a prior about a whole country.
 *
 * It sat at 0.9 until this was written down: level with the roast level and
 * above the process, while this comment claimed it sat below the process. The
 * number was the wrong one of the two. This is the single signal here that can
 * be confidently wrong about a bag nobody has ever met, and it was tied for the
 * loudest voice in the fold.
 *
 * Multiplied by the confidence the model declares, so a reading taken from
 * almost nothing carries almost nothing.
 */
export const MODEL_READING_WEIGHT = 0.75;
