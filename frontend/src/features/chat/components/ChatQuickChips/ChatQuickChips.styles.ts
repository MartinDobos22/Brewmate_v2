import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ChatQuickChipsStyleMap = ViewStyles<'row' | 'chip' | 'pressed' | 'disabled'>;

/**
 * Shortcuts to writing, laid out along one line that scrolls sideways.
 *
 * They used to wrap onto as many rows as they needed, which above a pinned
 * composer would push the field itself halfway up the screen on a small phone.
 * One line keeps the bar the same height whatever is in it, and the six
 * complaints people actually have are short enough that three of them are
 * visible without anybody scrolling at all.
 *
 * Drawn as pills on the secondary surface rather than as the bordered filter
 * chip the rest of the app uses: nothing here is selected and nothing stays
 * pressed - a chip fills the box and the box is what answers.
 */
export const createChatQuickChipsStyles = (theme: Theme): ChatQuickChipsStyleMap =>
  StyleSheet.create({
    row: { gap: theme.spacing.sm, paddingRight: theme.spacing.lgPlus },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      height: theme.size.chipHeight,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.surfaceVariant,
    },
    pressed: { opacity: theme.opacity.pressed },
    disabled: { opacity: theme.opacity.disabled },
  });
