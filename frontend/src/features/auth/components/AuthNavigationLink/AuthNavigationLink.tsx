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
}

/** The way between the sign-in, registration and password reset screens. */
export const AuthNavigationLink = ({
  question,
  action,
  href,
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
        router.push(href);
      }}
    >
      {question === undefined ? null : (
        <Text variant="bodySmall" tone="muted">
          {question}
        </Text>
      )}
      <Text variant="labelLarge" tone="primary">
        {action}
      </Text>
    </Pressable>
  );
};
