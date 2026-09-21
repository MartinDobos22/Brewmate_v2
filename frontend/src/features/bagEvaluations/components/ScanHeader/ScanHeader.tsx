import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { EspressoHeader } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { useTranslation, type TranslationKey } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { SCAN_ICONS } from '../../constants';

import { createScanHeaderStyles } from './ScanHeader.styles';

export interface ScanHeaderProps {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
}

/**
 * The block every stage of the scan up to the verdict is led by.
 *
 * It changes what it says rather than disappearing: standing in a shop with a
 * bag in one hand, the thing worth keeping on screen is what this screen is
 * about, and a block that vanished after the first tap would leave three
 * stages that look like three unrelated forms.
 */
export const ScanHeader = ({ titleKey, bodyKey }: ScanHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createScanHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <EspressoHeader>
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name={SCAN_ICONS.scan}
          size={theme.size.iconMedium}
          color={theme.colors.accentOnEspresso}
        />
      </View>
      <View style={styles.text}>
        <Text variant="displayAnswer" tone="onEspresso">
          {t(titleKey)}
        </Text>
        <Text variant="bodyText" tone="onEspressoMuted">
          {t(bodyKey)}
        </Text>
      </View>
    </EspressoHeader>
  );
};
