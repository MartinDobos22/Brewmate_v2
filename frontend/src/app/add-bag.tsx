import type { JSX } from 'react';

import { BAG_SCAN_MODES } from '../features/bagEvaluations/constants';
import { ScanBagScreen } from '../features/bagEvaluations/components';

/**
 * The scanner's camera pointed at the cupboard.
 *
 * The same screen as the shop tab over the same parsing layer; only the end
 * differs - a row in the cupboard rather than an opinion. It is its own route
 * rather than a parameter on the tab because a tab keeps its state between
 * visits, and a shop scan half done must not turn into a cupboard entry
 * because somebody pressed "pridať" on another screen in the meantime.
 */
export default function AddBagRoute(): JSX.Element {
  return <ScanBagScreen mode={BAG_SCAN_MODES.inventory} />;
}
