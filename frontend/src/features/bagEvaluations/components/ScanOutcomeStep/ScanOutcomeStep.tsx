import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { OUTCOME_ICONS, SCAN_ICONS } from '../../constants';
import type { BagScan } from '../../hooks/useBagScan';

import { createScanOutcomeStyles } from './ScanOutcomeStep.styles';

export interface ScanOutcomeStepProps {
  readonly scan: BagScan;
  /** Offered only where there is somewhere to go back to. */
  readonly onScanAnother?: () => void;
}

/**
 * Did the advice survive contact with the shelf?
 *
 * The only way the app ever learns whether it was any good at this. Buying the
 * bag also writes it into the cupboard, because somebody who just decided to
 * buy a coffee should not have to type its label in a second time.
 */
export const ScanOutcomeStep = ({ scan, onScanAnother }: ScanOutcomeStepProps): JSX.Element => {
  const styles = useThemedStyles(createScanOutcomeStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.words}>
        <Text variant="sectionHeading">{t(TRANSLATION_KEYS.scanOutcomeTitle)}</Text>
        <Text variant="bodyMuted" tone="muted">
          {t(TRANSLATION_KEYS.scanOutcomeBody)}
        </Text>
        {scan.outcome.hasFailed ? (
          <Text variant="bodyMuted" tone="error">
            {t(TRANSLATION_KEYS.scanError)}
          </Text>
        ) : null}
      </View>
      <View style={styles.buttons}>
        <PillButton
          tone="espresso"
          grows
          icon={OUTCOME_ICONS.bought}
          label={t(TRANSLATION_KEYS.scanOutcomeBought)}
          isPending={scan.outcome.isPending}
          onPress={(): void => {
            scan.outcome.recordPurchase(scan.label, t(TRANSLATION_KEYS.inventoryUnnamedCoffee));
          }}
        />
        <PillButton
          grows
          icon={OUTCOME_ICONS.left}
          label={t(TRANSLATION_KEYS.scanOutcomeSkipped)}
          onPress={scan.outcome.recordSkipped}
        />
      </View>
      {onScanAnother === undefined ? null : (
        <PillButton
          tone="surfaceLead"
          size="small"
          icon={SCAN_ICONS.scan}
          label={t(TRANSLATION_KEYS.scanAnother)}
          onPress={onScanAnother}
        />
      )}
    </View>
  );
};
