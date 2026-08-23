import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_SCAN_STAGES, type BagScanMode } from '../../constants/bagScan';
import { useBagScan } from '../../hooks/useBagScan';
import { ScanHistoryList } from '../ScanHistoryList';

import { ScanStageContent } from './ScanStageContent';

export interface ScanBagScreenProps {
  /** Set when the cupboard sent somebody here to add a bag rather than ask about one. */
  readonly initialMode?: BagScanMode;
}

/**
 * "Mám si ju kúpiť?", asked in front of a shelf - and the same camera used to
 * fill in the cupboard.
 *
 * The one thing a brand-new account can do that pays off the same afternoon:
 * it needs no cupboard and no brewing history, only the questionnaire - and
 * when even that is missing it says so instead of guessing. That is why it
 * sits on the home screen rather than three taps inside the inventory.
 */
export const ScanBagScreen = ({ initialMode }: ScanBagScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const scan = useBagScan(initialMode);

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.scanTitle)}</Text>
      <ScanStageContent scan={scan} />
      {scan.stage === BAG_SCAN_STAGES.mode ? <ScanHistoryList /> : null}
    </Screen>
  );
};
