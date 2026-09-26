import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';
import { DEFAULT_INPUT_GROUND, fieldSurface } from '../Input';

type DropdownStyleMap = ViewStyles<
  'wrapper' | 'pressed' | 'disabled' | 'value' | 'badge' | 'list' | 'options' | 'empty'
>;

/**
 * A closed dropdown is built from the same surface as an `Input`, because
 * that is what it is: a field holding one answer. Anything shorter would read
 * as a label, and a label is not something anybody taps - and two places
 * deciding separately what a field looks like is two fields on the brewing
 * screen that disagree with each other.
 *
 * Its height is its own: a dropdown prints a caption under the answer where a
 * text field prints one line, so it grows rather than being cut off.
 */
export const dropdownField = (theme: Theme): ViewStyle => ({
  ...fieldSurface(theme, DEFAULT_INPUT_GROUND, null),
  minHeight: theme.size.inputHeight,
  gap: theme.spacing.md,
  paddingVertical: theme.spacing.sm,
});

export const createDropdownStyles = (theme: Theme): DropdownStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
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
      backgroundColor: theme.colors.surface,
    },
    /** The panel scrolls rather than the screen behind it. */
    list: { flexShrink: 1 },
    options: { gap: theme.spacing.sm, paddingBottom: theme.spacing.md },
    empty: { paddingVertical: theme.spacing.lg },
  });
