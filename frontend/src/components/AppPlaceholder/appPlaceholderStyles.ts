import { StyleSheet } from 'react-native';

import { COLORS, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, RADII, SPACING } from '../../theme';

/** Styles live beside the component but never inside its JSX. */
export const appPlaceholderStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  card: {
    borderRadius: RADII.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  title: {
    color: COLORS.espresso,
    fontSize: FONT_SIZES.title,
    lineHeight: LINE_HEIGHTS.title,
    fontWeight: FONT_WEIGHTS.bold,
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    fontWeight: FONT_WEIGHTS.regular,
  },
});
