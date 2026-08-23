import type { BagEvaluation } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { ListItem, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useBagEvaluations } from '../../hooks';
import { scanHistoryTitle, scanHistorySubtitle } from '../../services/scanHistoryEntry';

import { createScanHistoryListStyles } from './ScanHistoryList.styles';

const NOTHING = 0;

/**
 * Every bag this account has already been weighed up on.
 *
 * Here so the same coffee is not asked about twice - a shelf is exactly where
 * somebody picks up the same bag a second time, and being told "toto som ti už
 * hodnotil" with the answer beside it is more useful than being asked to read
 * a fresh opinion about it.
 *
 * Whether they bought it is printed too, because that is what turns the list
 * from a log into something worth scrolling.
 */
export const ScanHistoryList = (): JSX.Element | null => {
  const styles = useThemedStyles(createScanHistoryListStyles);
  const { t } = useTranslation();
  const evaluations = useBagEvaluations();
  const items = evaluations.data?.items ?? [];

  if (items.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.list}>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.scanHistoryTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.scanHistoryBody)}
      </Text>
      {items.map((evaluation: BagEvaluation): JSX.Element => (
        <ListItem
          key={evaluation.id}
          title={scanHistoryTitle(evaluation, t(TRANSLATION_KEYS.inventoryUnnamedCoffee))}
          subtitle={scanHistorySubtitle(evaluation, {
            bought: t(TRANSLATION_KEYS.scanHistoryBought),
            left: t(TRANSLATION_KEYS.scanHistoryLeft),
            undecided: t(TRANSLATION_KEYS.scanHistoryUndecided),
          })}
          showDivider
        />
      ))}
    </View>
  );
};
