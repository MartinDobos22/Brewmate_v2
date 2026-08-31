import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type BottomNavBarStyleMap = ViewStyles<'bar' | 'item' | 'pressed'>;

/**
 * The same surface and hairline the tab bar uses, from the same tokens.
 *
 * Not a copy of those values: a bar that differed from the navigator's by a
 * shade or a border would read as a different object appearing halfway through
 * a flow, which is the one thing it must not do.
 */
export const createBottomNavBarStyles = (theme: Theme): BottomNavBarStyleMap =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderTopWidth: theme.borderWidth.thin,
      borderTopColor: theme.colors.outlineVariant,
      paddingTop: theme.spacing.sm,
    },
    item: { flex: 1, alignItems: 'center', gap: theme.spacing.xxs },
    pressed: { opacity: theme.opacity.pressed },
  });

/**
 * The gesture bar's own height, given to the bar rather than to the content
 * above it.
 *
 * Built by a named function rather than written into the JSX for the same
 * reason every other runtime geometry in this app is: it only exists once the
 * device has been measured, and a style assembled at a call site is one no
 * stylesheet can be checked against.
 */
export const bottomNavInsetStyle = (inset: number): ViewStyle => ({ paddingBottom: inset });
