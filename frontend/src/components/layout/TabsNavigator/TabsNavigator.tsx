import { Tabs } from 'expo-router';
import type { JSX } from 'react';
import type { ColorValue } from 'react-native';

import { TAB_ICONS, TAB_LABEL_KEYS, TAB_ORDER, type TabSegment } from '../../../constants';
import { useTranslation } from '../../../i18n';
import { TabBarIcon } from '../TabBarIcon';

import { useTabScreenOptions } from './useTabScreenOptions';

interface TabIconProps {
  readonly color: ColorValue;
}

const renderIcon =
  (segment: TabSegment) =>
  ({ color }: TabIconProps): JSX.Element => <TabBarIcon name={TAB_ICONS[segment]} color={color} />;

/** The four tabs. Labels come from i18n, colours and sizes from the theme. */
export const TabsNavigator = (): JSX.Element => {
  const { t } = useTranslation();
  const screenOptions = useTabScreenOptions();

  return (
    <Tabs screenOptions={screenOptions}>
      {TAB_ORDER.map((segment: TabSegment): JSX.Element => (
        <Tabs.Screen
          key={segment}
          name={segment}
          options={{ title: t(TAB_LABEL_KEYS[segment]), tabBarIcon: renderIcon(segment) }}
        />
      ))}
    </Tabs>
  );
};
