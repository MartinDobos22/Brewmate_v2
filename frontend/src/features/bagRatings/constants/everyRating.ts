import { LIST_LIMIT_MAX, type BagRatingFilter } from '@brewmate/shared';

/**
 * Every rating on one page.
 *
 * The cupboard needs to know which of the bags on its shelf have been asked
 * about already, and a bag is rated at most twice - so the largest page the
 * API gives is years of coffee, and one request answers the whole shelf.
 */
export const EVERY_RATING: BagRatingFilter = { limit: LIST_LIMIT_MAX };
