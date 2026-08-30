import type { BagEvaluation } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDateTime } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { SCAN_OUTCOME_LABEL_KEYS, SCAN_OUTCOME_TONES } from '../../constants';
import { resolveScanOutcome, scanHistoryTitle, scanVerdictPreview } from '../../services';

import { createScanHistoryListStyles } from './ScanHistoryList.styles';

const EMPTY = '';

export interface ScanHistoryEntryProps {
  readonly evaluation: BagEvaluation;
}

/**
 * One coffee this account has already been weighed up on.
 *
 * The outcome is its own labelled line rather than the front half of a
 * subtitle string, so what happened after the advice can be seen at a glance
 * down the list - that is the only thing the app ever learns about whether it
 * was any good at this. The date sits beside it because a verdict from March
 * and one from yesterday are worth different amounts.
 */
export const ScanHistoryEntry = ({ evaluation }: ScanHistoryEntryProps): JSX.Element => {
  const styles = useThemedStyles(createScanHistoryListStyles);
  const { t } = useTranslation();
  const outcome = resolveScanOutcome(evaluation);
  const preview = scanVerdictPreview(evaluation);

  return (
    <Card>
      <Text variant="titleSmall">
        {scanHistoryTitle(evaluation, t(TRANSLATION_KEYS.inventoryUnnamedCoffee))}
      </Text>
      {preview === EMPTY ? null : (
        <Text variant="bodySmall" tone="muted">
          {preview}
        </Text>
      )}
      <View style={styles.meta}>
        <Text variant="labelSmall" tone={SCAN_OUTCOME_TONES[outcome]}>
          {t(SCAN_OUTCOME_LABEL_KEYS[outcome])}
        </Text>
        <Text variant="labelSmall" tone="muted">
          {formatDateTime(evaluation.createdAt)}
        </Text>
      </View>
    </Card>
  );
};
