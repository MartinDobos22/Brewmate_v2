import type { JSX } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createButtonStyles } from './Button.styles';
import {
  BUTTON_LABEL_TONES,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
} from './buttonVariants';

export interface ButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
}

export const Button = ({
  label,
  onPress,
  variant = DEFAULT_BUTTON_VARIANT,
  size = DEFAULT_BUTTON_SIZE,
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps): JSX.Element => {
  const styles = useThemedStyles(createButtonStyles);
  const theme = useTheme();
  const inactive = disabled || loading;
  const tone = inactive ? 'disabled' : BUTTON_LABEL_TONES[variant];

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    pressed && !inactive && styles.pressed,
    inactive && styles.disabled,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
    >
      {loading ? <ActivityIndicator color={theme.colors.onDisabled} /> : null}
      <Text variant="labelLarge" tone={tone}>
        {label}
      </Text>
    </Pressable>
  );
};
