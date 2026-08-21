import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type NumberStepperStyleMap = ViewStyles<
  'wrapper' | 'row' | 'button' | 'pressed' | 'disabled' | 'value'
>;

export const createNumberStepperStyles = (theme: Theme): NumberStepperStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    button: {
      width: theme.size.stepperButtonSize,
      height: theme.size.stepperButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.smallButton,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surface,
    },
    pressed: { backgroundColor: theme.colors.surfaceContainer },
    disabled: { opacity: theme.opacity.disabled },
    value: { flex: 1, alignItems: 'center' },
  });
