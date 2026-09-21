import type { JSX } from 'react';
import { View } from 'react-native';

import { HEADER_SCREEN_EDGES, Screen } from '../../../../components/layout';
import { StepProgress } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';
import { BAG_SCAN_STAGES, type BagScanMode } from '../../constants/bagScan';
import { useBagScan } from '../../hooks/useBagScan';
import { resolveScanSteps } from '../../services';
import { ScanHeader } from '../ScanHeader';
import { ScanHistoryList } from '../ScanHistoryList';

import { createScanBagScreenStyles } from './ScanBagScreen.styles';
import { readScanHeaderCopy } from './scanHeaderCopy';
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
 *
 * The step strip appears once the flow has started. At the first question
 * nothing has been committed to, and a bar under a block saying "krok 1 zo 4"
 * is a screen counting a journey nobody has set off on; from the camera
 * onwards it is the answer to a fair question asked one-handed in a shop.
 */
export const ScanBagScreen = ({ initialMode }: ScanBagScreenProps): JSX.Element => {
  const styles = useThemedStyles(createScanBagScreenStyles);
  const scan = useBagScan(initialMode);
  const steps = resolveScanSteps(scan.stage, scan.mode, initialMode === undefined);
  const header = readScanHeaderCopy(scan.stage);
  const isStarted = scan.stage !== BAG_SCAN_STAGES.mode;

  return (
    <Screen scrollable padded={false} edges={HEADER_SCREEN_EDGES}>
      {header === null ? null : <ScanHeader titleKey={header.titleKey} bodyKey={header.bodyKey} />}
      <View style={styles.content}>
        {isStarted && header !== null ? (
          <StepProgress current={steps.current} total={steps.total} />
        ) : null}
        <ScanStageContent scan={scan} />
        {scan.stage === BAG_SCAN_STAGES.mode ? <ScanHistoryList /> : null}
      </View>
    </Screen>
  );
};
