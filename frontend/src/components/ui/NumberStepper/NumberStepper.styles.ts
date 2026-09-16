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
    /**
     * A real width, not only a flex weight. `flex: 1` alone contributes
     * nothing to a row that is sizing itself to its content, so the number
     * came out zero points wide - wrapped one character per line and clipped
     * out of sight - and the control resized itself on every tap.
     */
    value: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
      minWidth: theme.size.stepperValueMinWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
