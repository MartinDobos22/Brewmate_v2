import type { JSX } from 'react';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import type { BagScan } from '../../hooks/useBagScan';

export interface ScanOutcomeStepProps {
  readonly scan: BagScan;
}

/**
 * Did the advice survive contact with the shelf?
 *
 * The only way the app ever learns whether it was any good at this. Buying the
 * bag also writes it into the cupboard, because somebody who just decided to
 * buy a coffee should not have to type its label in a second time.
 */
export const ScanOutcomeStep = ({ scan }: ScanOutcomeStepProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.scanOutcomeTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.scanOutcomeBody)}
      </Text>
      {scan.outcome.hasFailed ? (
        <Text variant="bodySmall" tone="error">
          {t(TRANSLATION_KEYS.scanError)}
        </Text>
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.scanOutcomeBought)}
        fullWidth
        loading={scan.outcome.isPending}
        onPress={(): void => {
          scan.outcome.recordPurchase(scan.label, t(TRANSLATION_KEYS.inventoryUnnamedCoffee));
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.scanOutcomeSkipped)}
        variant="tertiary"
        fullWidth
        onPress={scan.outcome.recordSkipped}
      />
    </Card>
  );
};
