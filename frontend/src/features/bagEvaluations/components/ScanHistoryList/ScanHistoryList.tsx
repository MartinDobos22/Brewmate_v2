import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BagEvaluation } from '@brewmate/shared';
import { Fragment, type JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { SCAN_ICONS } from '../../constants';
import { useBagEvaluations } from '../../hooks';

import { createScanHistoryListStyles } from './ScanHistoryList.styles';
import { ScanHistoryEntry } from './ScanHistoryEntry';

const NOTHING = 0;
const FIRST = 0;
const NO_ITEMS: readonly BagEvaluation[] = [];

/**
 * Every bag this account has already been weighed up on.
 *
 * Absent rather than empty on an account that has asked about nothing: a
 * heading over a card saying "zatiaľ nič" is a screen reporting that it has
 * not been used yet, on the one screen a brand-new account is most likely to
 * open first.
 */
export const ScanHistoryList = (): JSX.Element | null => {
  const styles = useThemedStyles(createScanHistoryListStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const evaluations = useBagEvaluations();
  const items = evaluations.data?.items ?? NO_ITEMS;

  if (items.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={SCAN_ICONS.history}
          size={theme.size.iconRow}
          color={theme.colors.onSurfaceVariant}
        />
        <View style={styles.title}>
          <Text variant="sectionHeading">{t(TRANSLATION_KEYS.scanHistoryTitle)}</Text>
        </View>
      </View>
      <View style={styles.list}>
        {items.map((evaluation: BagEvaluation, index: number): JSX.Element => (
          <Fragment key={evaluation.id}>
            {index === FIRST ? null : <View style={styles.divider} />}
            <ScanHistoryEntry evaluation={evaluation} />
          </Fragment>
        ))}
      </View>
    </View>
  );
};
