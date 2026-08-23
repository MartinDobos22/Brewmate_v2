import type { TasteAxes } from '@brewmate/shared';

import { fingerprint } from '../../../lib/fingerprint';
import { TASTE_AXIS_ORDER, type TasteAxisName } from '../../tasteProfile/constants';

const PREFIX = 'manual';
const SEPARATOR = '-';

/**
 * Identifies one hand correction by the values it sets.
 *
 * Saving the same sliders twice is the same statement and counts once;
 * changing one of them is a new statement. Without this, a double tap on a
 * slow connection would count as two independent opinions and inflate how
 * well Brewmate claims to know somebody.
 */
export const buildManualSourceRef = (axes: TasteAxes): string =>
  [
    PREFIX,
    fingerprint(
      Object.fromEntries(
        TASTE_AXIS_ORDER.map((axis: TasteAxisName): readonly [string, string] => [
          axis,
          String(axes[axis]),
        ]),
      ),
    ),
  ].join(SEPARATOR);
