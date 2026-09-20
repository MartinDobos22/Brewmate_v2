import type { JSX, ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STACK_SCREEN_EDGES } from '../../../../components/layout';
import { DriftingRings, Text } from '../../../../components/ui';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../../constants';
import { useIsOnline } from '../../../../hooks';
import { useTheme, useThemedStyles } from '../../../../theme';
import { AuthBrandMark } from '../AuthBrandMark';
import { OfflineNotice } from '../OfflineNotice';

import { createAuthScreenLayoutStyles } from './AuthScreenLayout.styles';

export interface AuthScreenLayoutProps {
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
}

/**
 * Shared chrome for the signed-out screens: the ground, the mark, the heading,
 * the offline notice and the room the form sits in.
 *
 * The whole screen is the espresso brown rather than a block of it laid over a
 * light one. Everywhere else in the app that block sits on top of something -
 * a cupboard, a profile, a history - and here there is nothing yet for it to
 * sit on, so it is the screen. It is the same brown in both colour schemes,
 * which means the first thing anybody sees is the same first thing whichever
 * way their phone is set.
 *
 * The mark is here rather than on each screen because all four signed-out
 * screens go through this layout, and an application that identified itself on
 * the sign-in page but not on the one asking for a forgotten password would be
 * identifying itself by accident.
 */
export const AuthScreenLayout = ({
  title,
  subtitle,
  children,
}: AuthScreenLayoutProps): JSX.Element => {
  const styles = useThemedStyles(createAuthScreenLayoutStyles);
  const theme = useTheme();
  const isOnline = useIsOnline();

  return (
    <SafeAreaView style={styles.root} edges={STACK_SCREEN_EDGES}>
      <View style={styles.ground}>
        <DriftingRings
          size={theme.size.authRingsSize}
          color={theme.colors.primary}
          placement="topCentre"
        />
        <KeyboardAvoidingView style={styles.ground} behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <AuthBrandMark />
            <View style={styles.header}>
              <Text variant="displayAnswer" tone="onEspresso">
                {title}
              </Text>
              <Text variant="bodyText" tone="onEspressoMuted">
                {subtitle}
              </Text>
            </View>
            {isOnline ? null : <OfflineNotice />}
            <View style={styles.body}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
