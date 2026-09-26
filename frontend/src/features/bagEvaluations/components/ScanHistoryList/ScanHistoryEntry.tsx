import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BagEvaluation } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  OUTCOME_ICONS,
  SCAN_OUTCOME_LABEL_KEYS,
  SCAN_OUTCOMES,
  SCAN_OUTCOME_TONES,
} from '../../constants';
import { resolveScanOutcome, scanHistoryTitle } from '../../services';

import { createScanHistoryListStyles } from './ScanHistoryList.styles';

export interface ScanHistoryEntryProps {
  readonly evaluation: BagEvaluation;
}

/**
 * One coffee this account has already been weighed up on.
 *
 * The glyph on the left is what happened rather than what the verdict said: a
 * basket for a bag that was bought, a cross for one left on the shelf, and a
 * question mark while neither has been answered. Not a tick and a cross -
 * leaving a coffee behind is not a failure, and the row must not read as
 * though it were.
 */
export const ScanHistoryEntry = ({ evaluation }: ScanHistoryEntryProps): JSX.Element => {
  const styles = useThemedStyles(createScanHistoryListStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const outcome = resolveScanOutcome(evaluation);
  const isBought = outcome === SCAN_OUTCOMES.bought;

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={OUTCOME_ICONS[outcome]}
        size={theme.size.iconLarge}
        color={isBought ? theme.colors.onFresh : theme.colors.onSurfaceVariant}
      />
      <View style={styles.body}>
        <Text variant="cardTitle" numberOfLines={1}>
          {scanHistoryTitle(evaluation, t(TRANSLATION_KEYS.inventoryUnnamedCoffee))}
        </Text>
        <Text variant="caption" tone={SCAN_OUTCOME_TONES[outcome]} numberOfLines={1}>
          {t(SCAN_OUTCOME_LABEL_KEYS[outcome])}
        </Text>
      </View>
    </View>
  );
};
