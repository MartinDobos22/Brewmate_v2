import type { CoffeeBag } from '../coffeeBags/coffeeBagSchema.js';

import { MILLISECONDS_PER_DAY } from './grindGuidanceFieldLimits.js';
import { UNKNOWN_COFFEE, type GrindCoffeeFacts } from './grindCoffeeFacts.js';

/**
 * How old the coffee is in days, or null when nobody printed a date on it.
 *
 * Floored rather than rounded, the same way the cupboard counts: a bag roasted
 * late yesterday is one day old, not two, and somebody counting days on a
 * shelf counts the same way.
 */
const daysSinceRoast = (roastDate: string | null, now: Date): number | null => {
  if (roastDate === null) {
    return null;
  }

  const days = Math.floor((now.getTime() - Date.parse(roastDate)) / MILLISECONDS_PER_DAY);

  return Number.isFinite(days) ? days : null;
};

/**
 * The three facts off a bag that move a grind, and nothing else.
 *
 * Lives here rather than beside either caller because both of them need it:
 * the API works out the starting point before writing a recipe, and the app
 * works out the same one before a single token is spent, and two copies of
 * this arithmetic would be two answers to "where do I start" that eventually
 * disagree on the same screen.
 *
 * A brew with no bag behind it maps onto the coffee nobody wrote anything down
 * about rather than onto a refusal - which produces the middle of the method's
 * own window, reported as exactly that.
 */
export const readGrindCoffeeFacts = (bag: CoffeeBag | null, now: Date): GrindCoffeeFacts =>
  bag === null
    ? UNKNOWN_COFFEE
    : {
        roastLevel: bag.roastLevel,
        process: bag.process,
        daysSinceRoast: daysSinceRoast(bag.roastDate, now),
      };
