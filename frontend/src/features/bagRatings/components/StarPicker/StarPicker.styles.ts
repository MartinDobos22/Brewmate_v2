import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type StarPickerStyleMap = ViewStyles<'row' | 'star' | 'pressed'>;

/**
 * Five stars in a row, each its own target.
 *
 * The target is the platform's minimum even though the glyph is bigger than
 * it, so a star pressed at its edge still counts as that star.
 */
export const createStarPickerStyles = (theme: Theme): StarPickerStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: theme.spacing.xs },
    star: {
      minWidth: theme.size.minTouchTarget,
      minHeight: theme.size.minTouchTarget,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { opacity: theme.opacity.pressed },
  });
