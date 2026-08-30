import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BagScanStage } from '../../constants/bagScan';
import { resolveScanSteps } from '../../services';
import type { BagScanMode } from '../../constants/bagScan';

import { createScanProgressStyles, segmentWidth } from './ScanProgress.styles';

const NONE = 0;

export interface ScanProgressProps {
  readonly stage: BagScanStage;
  readonly mode: BagScanMode;
  /** False when the cupboard already answered the first question for them. */
  readonly hasModeStep: boolean;
}

/**
 * How far through a scan somebody is.
 *
 * This flow is used standing in a shop, one-handed, with a bag in the other -
 * the one place in this app where "how much more of this is there" is a fair
 * question to be able to answer. Without it the screen simply changed under
 * somebody four times and they had no way to tell whether they were nearly
 * done or had just started.
 *
 * It draws nothing once the scan is over: what is on that screen is what
 * happened, not a step left to get through.
 */
export const ScanProgress = ({
  stage,
  mode,
  hasModeStep,
}: ScanProgressProps): JSX.Element | null => {
  const styles = useThemedStyles(createScanProgressStyles);
  const { t } = useTranslation();
  const steps = resolveScanSteps(stage, mode, hasModeStep);

  if (steps.current === NONE) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text variant="labelSmall" tone="muted">
        {t(TRANSLATION_KEYS.scanStepCount, { current: steps.current, total: steps.total })}
      </Text>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: NONE, max: steps.total, now: steps.current }}
      >
        {steps.stages.map((name: BagScanStage, index: number): JSX.Element => (
          <View
            key={name}
            style={[
              styles.segment,
              index < steps.current ? styles.done : styles.todo,
              segmentWidth(),
            ]}
          />
        ))}
      </View>
    </View>
  );
};
