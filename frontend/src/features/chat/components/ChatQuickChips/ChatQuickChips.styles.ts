import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type ChatQuickChipsStyleMap = ViewStyles<'row'>;

/**
 * Shortcuts to writing, laid out along one line that scrolls sideways.
 *
 * They used to wrap onto as many rows as they needed, which above a pinned
 * composer would push the field itself halfway up the screen on a small phone.
 * One line keeps the bar the same height whatever is in it, and the six
 * complaints people actually have are short enough that three of them are
 * visible without anybody scrolling at all.
 */
export const createChatQuickChipsStyles = (theme: Theme): ChatQuickChipsStyleMap =>
  StyleSheet.create({
    row: { gap: theme.spacing.sm, paddingRight: theme.spacing.lgPlus },
  });
