import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import type { Route } from '../../../../constants';
import { useThemedStyles } from '../../../../theme';

import { createAuthNavigationLinkStyles } from './AuthNavigationLink.styles';

export interface AuthNavigationLinkProps {
  /** Left unset for a link that stands on its own, such as "forgot password". */
  readonly question?: string;
  readonly action: string;
  readonly href: Route;
  /**
   * Replaces the current screen rather than pushing onto it.
   *
   * For the one link that is a way out of the signed-out flow rather than a
   * way around inside it: leaving the verification nudge for the app itself
   * should not leave that nudge behind the back gesture.
   */
  readonly replaces?: boolean;
}

/** The way between the sign-in, registration and password reset screens. */
export const AuthNavigationLink = ({
  question,
  action,
  href,
  replaces = false,
}: AuthNavigationLinkProps): JSX.Element => {
  const styles = useThemedStyles(createAuthNavigationLinkStyles);
  const router = useRouter();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.row,
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      accessibilityRole="link"
      accessibilityLabel={action}
      onPress={(): void => {
        if (replaces) {
          router.replace(href);

          return;
        }

        router.push(href);
      }}
    >
      {question === undefined ? null : (
        <Text variant="bodyMuted" tone="onEspressoMuted">
          {question}
        </Text>
      )}
      <Text variant="actionLabel" tone="accent">
        {action}
      </Text>
    </Pressable>
  );
};
