import type { JSX } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';
import { createAuthSubmitButtonStyles } from '../AuthSubmitButton';

export interface VerifyEmailActionProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly isPending: boolean;
}

/**
 * The second thing this screen offers, beside the one it most wants pressed.
 *
 * Sending the link again is what somebody reaches for when the first one never
 * arrived, which is common enough to belong on the screen and not common
 * enough to be the button they see first.
 */
export const VerifyEmailAction = ({
  label,
  onPress,
  isPending,
}: VerifyEmailActionProps): JSX.Element => {
  const styles = useThemedStyles(createAuthSubmitButtonStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.provider,
    pressed && !isPending && styles.pressed,
    isPending && styles.disabled,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={isPending}
      accessibilityRole="button"
      accessibilityState={{ disabled: isPending, busy: isPending }}
      accessibilityLabel={label}
    >
      {isPending ? <ActivityIndicator color={theme.colors.accentSoft} /> : null}
      <Text variant="rowTitle" tone="onEspresso" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};
