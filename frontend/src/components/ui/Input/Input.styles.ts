import { StyleSheet } from 'react-native';

import type { TextStyles, Theme, ViewStyles } from '../../../theme';

type InputStyleMap = ViewStyles<
  'wrapper' | 'field' | 'focused' | 'errored' | 'unverified' | 'disabled'
> &
  TextStyles<'text'>;

/** Inputs share the chip radius: 8, the small end of the scale. */
export const createInputStyles = (theme: Theme): InputStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    field: {
      height: theme.size.inputHeight,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.shape.input,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    focused: { borderWidth: theme.borderWidth.thick, borderColor: theme.colors.primary },
    errored: { borderColor: theme.colors.error },
    /** Ochre rather than red: the value is unverified, not wrong. */
    unverified: { borderWidth: theme.borderWidth.thick, borderColor: theme.colors.tertiary },
    disabled: { backgroundColor: theme.colors.disabled, borderColor: theme.colors.disabled },
    text: {
      ...theme.typography.bodyLarge,
      color: theme.colors.onSurface,
      padding: theme.spacing.none,
    },
  });
