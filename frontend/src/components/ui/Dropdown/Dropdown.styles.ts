import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type DropdownStyleMap = ViewStyles<
  'wrapper' | 'field' | 'pressed' | 'disabled' | 'value' | 'badge' | 'list' | 'options' | 'empty'
>;

/**
 * A closed dropdown is built to the same metrics as an `Input`, because that
 * is what it is: a field holding one answer. Anything shorter would read as a
 * label, and a label is not something anybody taps.
 */
export const createDropdownStyles = (theme: Theme): DropdownStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
    field: {
      minHeight: theme.size.inputHeight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.shape.input,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surface,
    },
    pressed: { backgroundColor: theme.colors.surfaceContainer },
    disabled: { opacity: theme.opacity.disabled },
    /** Takes the space the chevron and the glyph leave, so a long name truncates. */
    value: { flexShrink: 1, flexGrow: 1, flexBasis: 0, gap: theme.spacing.xxs },
    badge: {
      width: theme.size.tileBadgeSize,
      height: theme.size.tileBadgeSize,
      borderRadius: theme.shape.avatar,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    /** The panel scrolls rather than the screen behind it. */
    list: { flexShrink: 1 },
    options: { gap: theme.spacing.sm, paddingBottom: theme.spacing.md },
    empty: { paddingVertical: theme.spacing.lg },
  });
