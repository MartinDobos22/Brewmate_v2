import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_ICONS,
  TAB_LABEL_KEYS,
  TAB_ORDER,
  TAB_ROUTES,
  type TabSegment,
} from '../../../constants';
import { useTranslation } from '../../../i18n';
import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../../ui';
import { TabBarIcon } from '../TabBarIcon';

import { bottomNavInsetStyle, createBottomNavBarStyles } from './BottomNavBar.styles';

/**
 * The four destinations, on the screens the tab navigator does not reach.
 *
 * Half this application is pushed on top of the tabs - the scanner, the
 * conversation after a cup, a coffee's own screen, the history, what the model
 * calls have cost - and on every one of them the bar simply vanished. The way
 * back was a gesture, or a header arrow, and getting from a scan to the
 * cupboard meant retracing the whole path that led there.
 *
 * Nothing is highlighted, deliberately. A screen pushed on top of the tabs
 * does not belong to one of them, and lighting up "Skrinka" while somebody
 * reads their brewing history would be the bar telling them where they are and
 * being wrong. It is a way out, not a claim about where you are - the four
 * places, always in the same order, always in the same spot.
 */
export const BottomNavBar = (): JSX.Element => {
  const styles = useThemedStyles(createBottomNavBarStyles);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.item,
    pressed && styles.pressed,
  ];

  return (
    <View style={[styles.bar, bottomNavInsetStyle(insets.bottom)]}>
      {TAB_ORDER.map((segment: TabSegment): JSX.Element => (
        <Pressable
          key={segment}
          style={resolveStyle}
          accessibilityRole="button"
          accessibilityLabel={t(TAB_LABEL_KEYS[segment])}
          onPress={(): void => {
            /*
             * Navigate rather than push: these four are places the app already
             * has open, and pushing a second copy of the cupboard on top of the
             * one somebody left would make the back gesture walk through both.
             */
            router.navigate(TAB_ROUTES[segment]);
          }}
        >
          <TabBarIcon name={TAB_ICONS[segment]} color={theme.colors.onSurfaceVariant} />
          <Text variant="labelSmall" tone="muted">
            {t(TAB_LABEL_KEYS[segment])}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
