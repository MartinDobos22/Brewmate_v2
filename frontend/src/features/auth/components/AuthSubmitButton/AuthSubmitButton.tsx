import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTheme, useThemedStyles } from '../../../../theme';
import { AUTH_ICONS } from '../../constants';

import { createAuthSubmitButtonStyles } from './AuthSubmitButton.styles';

export interface AuthSubmitButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly isPending?: boolean;
  readonly disabled?: boolean;
}

/** The one button a signed-out screen most wants pressed. */
export const AuthSubmitButton = ({
  label,
  onPress,
  isPending = false,
  disabled = false,
}: AuthSubmitButtonProps): JSX.Element => {
  const styles = useThemedStyles(createAuthSubmitButtonStyles);
  const theme = useTheme();
  const isBlocked = disabled || isPending;

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.button,
    pressed && !isBlocked && styles.pressed,
    isBlocked && styles.disabled,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={isBlocked}
      accessibilityRole="button"
      accessibilityState={{ disabled: isBlocked, busy: isPending }}
      accessibilityLabel={label}
    >
      {isPending ? (
        <ActivityIndicator color={theme.colors.onCream} />
      ) : (
        <MaterialCommunityIcons
          name={AUTH_ICONS.submit}
          size={theme.size.iconLarge}
          color={theme.colors.onCream}
        />
      )}
      <Text variant="cardTitle" tone="onCream" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
};
