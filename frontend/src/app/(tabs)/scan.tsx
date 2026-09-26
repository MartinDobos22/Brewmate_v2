import type { JSX } from 'react';

import { BAG_SCAN_MODES } from '../../features/bagEvaluations/constants';
import { ScanBagScreen } from '../../features/bagEvaluations/components';

/**
 * The shop scanner, as a tab of its own.
 *
 * "Mám si ju kúpiť?" is asked in front of a shelf with a bag in the other
 * hand, so the tab opens straight on the camera. The question it used to open
 * with - am I in a shop, or do I already own this? - answered itself: somebody
 * who owns the coffee reaches the same camera from the cupboard, at
 * `/add-bag`.
 */
export default function ScanTab(): JSX.Element {
  return <ScanBagScreen mode={BAG_SCAN_MODES.verdict} />;
}
