import type { JSX } from 'react';
import { View } from 'react-native';

import { OptionCard, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { SCAN_ICONS } from '../../constants';
import { BAG_SCAN_MODES, type BagScanMode } from '../../constants/bagScan';

import { createScanModeStepStyles } from './ScanModeStep.styles';

export interface ScanModeStepProps {
  readonly onChoose: (mode: BagScanMode) => void;
}

/**
 * What did you come here to do?
 *
 * Asked rather than guessed, because the two answers lead to genuinely
 * different screens and neither is rare: a bag in a shop is a question, a bag
 * in a carrier is a row in the cupboard. Guessing wrong would put a verdict in
 * front of somebody who already owns the coffee.
 *
 * The shop question comes first: it is the one thing a brand-new account can
 * do in its first minute and get something real back from.
 */
export const ScanModeStep = ({ onChoose }: ScanModeStepProps): JSX.Element => {
  const styles = useThemedStyles(createScanModeStepStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.options}>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.scanIntro)}
      </Text>
      <OptionCard
        label={t(TRANSLATION_KEYS.scanModeVerdictTitle)}
        note={t(TRANSLATION_KEYS.scanModeVerdictBody)}
        icon={SCAN_ICONS.shop}
        onPress={(): void => {
          onChoose(BAG_SCAN_MODES.verdict);
        }}
      />
      <OptionCard
        label={t(TRANSLATION_KEYS.scanModeInventoryTitle)}
        note={t(TRANSLATION_KEYS.scanModeInventoryBody)}
        icon={SCAN_ICONS.cupboard}
        onPress={(): void => {
          onChoose(BAG_SCAN_MODES.inventory);
        }}
      />
    </View>
  );
};
