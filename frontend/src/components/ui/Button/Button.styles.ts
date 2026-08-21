import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

import type { ButtonSize, ButtonVariant } from './buttonVariants';

type ButtonStyleMap = ViewStyles<
  'base' | ButtonVariant | ButtonSize | 'pressed' | 'disabled' | 'fullWidth'
>;

/** Buttons are rectangles with a radius of 12 - never pills. */
export const createButtonStyles = (theme: Theme): ButtonStyleMap =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      borderRadius: theme.shape.button,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
    },
    medium: { height: theme.size.buttonHeightMedium },
    small: { height: theme.size.buttonHeightSmall, paddingHorizontal: theme.spacing.md },
    primary: { backgroundColor: theme.colors.primary },
    secondary: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primaryContainer,
    },
    tertiary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
    danger: { backgroundColor: theme.colors.error, borderColor: theme.colors.error },
    pressed: { opacity: theme.opacity.pressed },
    disabled: {
      backgroundColor: theme.colors.disabled,
      borderColor: theme.colors.disabled,
      opacity: theme.opacity.disabled,
    },
    fullWidth: { alignSelf: 'stretch' },
  });
