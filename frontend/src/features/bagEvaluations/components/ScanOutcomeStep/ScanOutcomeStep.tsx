import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
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
  const theme = useTheme();
  const { t } = useTranslation();

  const boughtStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.bought,
    pressed && styles.pressed,
  ];

  const leftStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.left,
    pressed && styles.pressed,
  ];

  const againStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.again,
    pressed && styles.pressed,
  ];

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
        <Pressable
          style={boughtStyle}
          disabled={scan.outcome.isPending}
          onPress={(): void => {
            scan.outcome.recordPurchase(scan.label, t(TRANSLATION_KEYS.inventoryUnnamedCoffee));
          }}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.scanOutcomeBought)}
        >
          <MaterialCommunityIcons
            name={OUTCOME_ICONS.bought}
            size={theme.size.iconMedium}
            color={theme.colors.cream}
          />
          <Text variant="rowTitle" tone="onCream">
            {t(TRANSLATION_KEYS.scanOutcomeBought)}
          </Text>
        </Pressable>
        <Pressable
          style={leftStyle}
          onPress={scan.outcome.recordSkipped}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.scanOutcomeSkipped)}
        >
          <MaterialCommunityIcons
            name={OUTCOME_ICONS.left}
            size={theme.size.iconMedium}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="rowTitle">{t(TRANSLATION_KEYS.scanOutcomeSkipped)}</Text>
        </Pressable>
      </View>
      {onScanAnother === undefined ? null : (
        <Pressable
          style={againStyle}
          onPress={onScanAnother}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.scanAnother)}
        >
          <MaterialCommunityIcons
            name={SCAN_ICONS.scan}
            size={theme.size.iconSmall}
            color={theme.colors.primary}
          />
          <Text variant="actionLabel" tone="primary">
            {t(TRANSLATION_KEYS.scanAnother)}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
