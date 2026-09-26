import type { CoffeeBag } from '@brewmate/shared';

import { HALFWAY_SHARE } from '../constants/halfway';

/**
 * Whether a bag is far enough through to be asked how it is going.
 *
 * Only for a bag whose weight and whose remaining amount are both known. A
 * bag nobody weighed is still asked - on its own screen, whenever somebody
 * opens it - but the cupboard does not interrupt a shelf with a question it
 * cannot tell is due.
 */
export const isHalfway = (bag: CoffeeBag): boolean =>
  !bag.isArchived &&
  bag.weightGrams !== null &&
  bag.remainingGrams !== null &&
  bag.remainingGrams <= bag.weightGrams * HALFWAY_SHARE;
