/**
 * Bounds for what a model is allowed to claim about a photograph.
 *
 * Confidence is a fraction rather than a percentage for the same reason the
 * taste profile stores one: a number written as "82 %" invites the reader to
 * believe the digit after the decimal point. The app rounds it into words.
 */
export const PARSED_CONFIDENCE_MIN = 0;
export const PARSED_CONFIDENCE_MAX = 1;

/**
 * A field read this uncertainly is shown to the user as needing a second look
 * before it is saved.
 *
 * Deliberately generous: a label read wrongly and saved silently is a coffee
 * that lies about itself in every recipe afterwards, and the cost of asking is
 * one glance at a highlighted box.
 */
export const PARSED_CONFIDENCE_LOW_THRESHOLD = 0.7;

/** A field nothing could be read into carries no confidence at all. */
export const PARSED_CONFIDENCE_NONE = 0;

/** Bounds for what the shop verdict is allowed to say. */
export const AI_VERDICT_SENTENCES_MIN = 2;
export const AI_VERDICT_SENTENCES_MAX = 4;

/** How much somebody may say about beans that are not in the cupboard. */
export const COFFEE_DESCRIPTION_MAX_LENGTH = 500;

/**
 * How many earlier versions of a recipe travel with a chat message.
 *
 * Three, because that is what the conversation is actually about: this cup,
 * the one before it and what changed between them. A longer tail turns a
 * question about this morning into an argument with a month of history.
 */
export const RECIPE_CHAT_HISTORY_VERSIONS = 3;
