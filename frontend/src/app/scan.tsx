import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { BAG_SCAN_MODES, type BagScanMode } from '../features/bagEvaluations/constants';
import { ScanBagScreen } from '../features/bagEvaluations/components';

const isMode = (value: string | undefined): value is BagScanMode =>
  value === BAG_SCAN_MODES.verdict || value === BAG_SCAN_MODES.inventory;

/**
 * The shop scanner, and the same camera pointed at the cupboard.
 *
 * `?mode=inventory` is how the inventory sends somebody straight to the camera:
 * they already answered the question this screen would otherwise open with.
 */
export default function ScanRoute(): JSX.Element {
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  return <ScanBagScreen initialMode={isMode(mode) ? mode : undefined} />;
}
