import type { InterpolationValues } from '../../../lib/text';
import { HOME_HINT_IDS, HOME_HINT_TIPS, type HomeHintId } from '../constants/homeHints';
import { HOME_STATS } from '../constants/homeTiles';

import type { InventoryHighlight } from '../../inventory/services';

const NOTHING = 0;

/**
 * Where the rotation starts, and the answer if a modulo could ever miss.
 *
 * It cannot - the list is never empty - but the compiler has no way to know
 * that, and inventing an assertion to tell it so would be worse than naming a
 * first tip.
 */
const FIRST_TIP = HOME_HINT_IDS.tipGrind;

export interface HomeHintInput {
  readonly bagCount: number;
  readonly aging: InventoryHighlight | null;
  readonly resting: InventoryHighlight | null;
  readonly ready: InventoryHighlight | null;
  readonly hasBrewed: boolean;
  readonly daysSinceLastBrew: number | null;
  /** Whole days since the epoch, which is what makes the tip rotate daily. */
  readonly dayIndex: number;
}

export interface HomeHint {
  readonly id: HomeHintId;
  /** Fills the hole in the hint's own sentence, where it has one. */
  readonly values: InterpolationValues | undefined;
}

const named = (id: HomeHintId, bag: InventoryHighlight): HomeHint => ({
  id,
  values: { name: bag.name },
});

/**
 * The one thing worth saying on the home screen right now.
 *
 * One hint, not a list. A screen that offered five pieces of advice at once
 * would be one nobody reads any of, and the ordering here is the whole point:
 * something true about this account beats a general tip, and a bag going off
 * on somebody's shelf beats being told to weigh their coffee.
 *
 * Nothing here says anything about the taste profile. The tile underneath the
 * hint already says it, in the same words, leading to the same questionnaire -
 * and one screen asking twice is not twice as persuasive.
 *
 * When there is genuinely nothing to report it teaches one thing instead,
 * picked by the calendar day. A card that went blank on a well-kept account
 * would punish exactly the people using the app properly.
 */
export const resolveHomeHint = (input: HomeHintInput): HomeHint => {
  if (input.bagCount === NOTHING) {
    return { id: HOME_HINT_IDS.noCoffee, values: undefined };
  }

  if (input.aging !== null) {
    return named(HOME_HINT_IDS.aging, input.aging);
  }

  if (!input.hasBrewed) {
    return { id: HOME_HINT_IDS.firstBrew, values: undefined };
  }

  if (input.daysSinceLastBrew !== null && input.daysSinceLastBrew >= HOME_STATS.idleDays) {
    return { id: HOME_HINT_IDS.idle, values: undefined };
  }

  if (input.resting !== null) {
    return named(HOME_HINT_IDS.resting, input.resting);
  }

  if (input.ready !== null) {
    return named(HOME_HINT_IDS.ready, input.ready);
  }

  return {
    id: HOME_HINT_TIPS[input.dayIndex % HOME_HINT_TIPS.length] ?? FIRST_TIP,
    values: undefined,
  };
};
