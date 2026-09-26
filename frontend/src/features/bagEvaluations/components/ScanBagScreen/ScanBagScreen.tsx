import type { JSX } from 'react';
import { View } from 'react-native';

import { HEADER_SCREEN_EDGES, Screen, TAB_SCREEN_EDGES } from '../../../../components/layout';
import { StepProgress } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';
import { BAG_SCAN_MODES, BAG_SCAN_STAGES, type BagScanMode } from '../../constants/bagScan';
import { useBagScan } from '../../hooks/useBagScan';
import { resolveScanSteps } from '../../services';
import { ScanHeader } from '../ScanHeader';
import { ScanHistoryList } from '../ScanHistoryList';

import { createScanBagScreenStyles } from './ScanBagScreen.styles';
import { readScanHeaderCopy } from './scanHeaderCopy';
import { ScanStageContent } from './ScanStageContent';

const FIRST_STEP = 1;

export interface ScanBagScreenProps {
  /** A bag in a shop or a bag on its way into the cupboard - the route's to say. */
  readonly mode: BagScanMode;
}

/**
 * "Mám si ju kúpiť?", asked in front of a shelf - and the same camera used to
 * fill in the cupboard.
 *
 * The one thing a brand-new account can do that pays off the same afternoon:
 * it needs no cupboard and no brewing history, only the questionnaire - and
 * when even that is missing it says so instead of guessing. That is why it is
 * a tab of its own rather than a button somewhere on the home screen.
 *
 * It opens on the camera. The step strip appears from the second stage on:
 * the camera is where somebody lands every time they open the tab, and a bar
 * under it saying "krok 1 z 3" is a screen counting a journey nobody has set
 * off on; from the form onwards it is the answer to a fair question asked
 * one-handed in a shop.
 *
 * What has already been judged sits under the camera in the shop, because the
 * same bag picked up a second time is exactly when somebody wants to see what
 * they were told the first time.
 *
 * Which insets the screen takes follows the block. A screen led by one gives
 * the top away to it, because the block is what reaches the notch; the
 * verdict and the outcome draw no block, and were running their first card
 * under the status bar with the clock printed across it. The bottom is never
 * the screen's - the tab bar or the shared bar under it takes that.
 */
export const ScanBagScreen = ({ mode }: ScanBagScreenProps): JSX.Element => {
  const styles = useThemedStyles(createScanBagScreenStyles);
  const scan = useBagScan(mode);
  const steps = resolveScanSteps(scan.stage, scan.mode);
  const header = readScanHeaderCopy(scan.stage);
  const isStarted = steps.current > FIRST_STEP;
  const showsHistory = scan.stage === BAG_SCAN_STAGES.capture && mode === BAG_SCAN_MODES.verdict;

  return (
    <Screen
      scrollable
      padded={false}
      edges={header === null ? TAB_SCREEN_EDGES : HEADER_SCREEN_EDGES}
      onBack={scan.stepBack}
    >
      {header === null ? null : <ScanHeader titleKey={header.titleKey} bodyKey={header.bodyKey} />}
      <View style={styles.content}>
        {isStarted && header !== null ? (
          <StepProgress current={steps.current} total={steps.total} />
        ) : null}
        <ScanStageContent scan={scan} />
        {showsHistory ? <ScanHistoryList /> : null}
      </View>
    </Screen>
  );
};
