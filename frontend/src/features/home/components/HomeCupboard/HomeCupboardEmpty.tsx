import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { HOME_TILE_ICONS } from '../../constants';

import { createHomeCupboardStyles } from './HomeCupboard.styles';

/**
 * An empty shelf, said in one line with the way to fill it beside it.
 *
 * Not the cupboard's own empty screen in miniature: that one argues the case
 * for writing coffee down, and it has a whole screen to do it in. Here the
 * section has already been named, so all that is left to say is that there is
 * nothing in it yet - and the button is what makes that a offer rather than
 * a complaint.
 */
export const HomeCupboardEmpty = (): JSX.Element => {
  const styles = useThemedStyles(createHomeCupboardStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.empty}>
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name={HOME_TILE_ICONS.inventory}
          size={theme.size.iconLarge}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
      <View style={styles.body}>
        <Text variant="bodyMuted" tone="muted">
          {t(TRANSLATION_KEYS.homeCupboardEmpty)}
        </Text>
      </View>
      <PillButton
        tone="espresso"
        size="compact"
        icon={HOME_TILE_ICONS.add}
        spokenLabel={t(TRANSLATION_KEYS.inventoryAddTitle)}
        onPress={(): void => {
          router.push(ROUTES.scan);
        }}
      />
    </View>
  );
};
