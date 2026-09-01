import {
  MATCH_DIRECTIONS,
  type AxisMatch,
  type CoffeeMatch,
  type TasteAxisName,
} from '@brewmate/shared';

import type { TranslationKey } from '../../../i18n';
import { MATCH_ALIGNED_KEYS, MATCH_DIRECTION_KEYS } from '../constants/matchLabels';

export interface MatchReason {
  readonly axis: TasteAxisName;
  readonly labelKey: TranslationKey;
  /** True where this counts against the coffee, so the list can mark it. */
  readonly isAgainst: boolean;
}

/**
 * The comparison as a short list of sentences, strongest first.
 *
 * Only the comparable axes appear, because the others were not compared - an
 * axis missing here is missing because either the person or the label said
 * nothing about it, and printing a reason for one of those would be the app
 * inventing an argument. The order is the matcher's own, which ranks by how
 * much each comparison actually says rather than by how well it is known: "tvoj
 * profil o tele hovorí zhruba to isté" is true, dull, and not why anybody
 * asked.
 */
export const readMatchReasons = (match: CoffeeMatch): readonly MatchReason[] =>
  match.comparable.map((axis: AxisMatch): MatchReason => {
    if (axis.direction === MATCH_DIRECTIONS.aligned) {
      return { axis: axis.axis, labelKey: MATCH_ALIGNED_KEYS[axis.axis], isAgainst: false };
    }

    return {
      axis: axis.axis,
      labelKey: MATCH_DIRECTION_KEYS[axis.axis][axis.direction],
      isAgainst: true,
    };
  });
