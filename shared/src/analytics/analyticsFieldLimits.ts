/**
 * How much one analytics batch may carry.
 *
 * A batch rather than a request per event, because these are sent from a
 * phone in a kitchen: one round trip when the connection comes back beats
 * fifteen that each fail on their own. The ceiling is what stops a queue that
 * has been accumulating offline for a week from arriving as one enormous body.
 */
export const ANALYTICS_BATCH_MAX = 50;

/** A property name is a short machine name, never a sentence. */
export const ANALYTICS_PROPERTY_KEY_MAX_LENGTH = 48;
export const ANALYTICS_PROPERTY_VALUE_MAX_LENGTH = 64;
export const ANALYTICS_PROPERTIES_MAX = 10;
