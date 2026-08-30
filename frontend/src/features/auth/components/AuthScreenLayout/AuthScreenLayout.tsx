import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';

import { Screen, STACK_SCREEN_EDGES } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { useIsOnline } from '../../../../hooks';
import { useThemedStyles } from '../../../../theme';
import { AuthBrandMark } from '../AuthBrandMark';
import { OfflineNotice } from '../OfflineNotice';

import { createAuthScreenLayoutStyles } from './AuthScreenLayout.styles';

export interface AuthScreenLayoutProps {
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
}

/**
 * Shared chrome for the signed-out screens: the mark, the heading, the offline
 * notice and the room the form sits in.
 *
 * The mark is here rather than on each screen because all four signed-out
 * screens go through this layout, and an application that identified itself on
 * the sign-in page but not on the one that asks for a forgotten password would
 * be identifying itself by accident.
 */
export const AuthScreenLayout = ({
  title,
  subtitle,
  children,
}: AuthScreenLayoutProps): JSX.Element => {
  const styles = useThemedStyles(createAuthScreenLayoutStyles);
  const isOnline = useIsOnline();

  return (
    <Screen scrollable edges={STACK_SCREEN_EDGES}>
      <AuthBrandMark />
      <View style={styles.header}>
        <Text variant="headlineMedium">{title}</Text>
        <Text variant="bodyMedium" tone="muted">
          {subtitle}
        </Text>
      </View>
      {isOnline ? null : <OfflineNotice />}
      <View style={styles.body}>{children}</View>
    </Screen>
  );
};
