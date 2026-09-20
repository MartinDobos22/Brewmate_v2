import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';

import { createOfflineNoticeStyles } from './OfflineNotice.styles';
import { OFFLINE_ICON } from './offlineIcon';

/**
 * Shown above every sign-in form while the device is offline, so a failed
 * attempt is explained before it happens rather than after.
 *
 * An inset block rather than a card: on this screen a white card would be a
 * piece of some other application dropped onto the brown, and what this says
 * is a remark about the screen it is on rather than a thing of its own.
 */
export const OfflineNotice = (): JSX.Element => {
  const styles = useThemedStyles(createOfflineNoticeStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <MaterialCommunityIcons
        name={OFFLINE_ICON}
        size={theme.size.iconRow}
        color={theme.colors.accentOnEspresso}
      />
      <View style={styles.body}>
        <Text variant="cardTitle" tone="onEspresso">
          {t(TRANSLATION_KEYS.authOfflineTitle)}
        </Text>
        <Text variant="bodyMuted" tone="onEspressoMuted">
          {t(TRANSLATION_KEYS.authOfflineBody)}
        </Text>
      </View>
    </View>
  );
};
