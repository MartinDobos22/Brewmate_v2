import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type RecipeChatScreenStyleMap = ViewStyles<
  'root' | 'scroll' | 'thread' | 'message' | 'save' | 'state'
>;

/**
 * A thread that scrolls under a header that does not, above a box that does
 * not either.
 *
 * The two fixed ends are the point. What is being brewed is what the whole
 * conversation is about, and where somebody answers is where they are looking
 * when they decide to - putting either inside the scroll means the second
 * question is asked from a screen showing neither.
 */
export const createRecipeChatScreenStyles = (theme: Theme): RecipeChatScreenStyleMap =>
  StyleSheet.create({
    /** Composed here rather than through `Screen`, so the ground is painted here. */
    root: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { flex: 1 },
    thread: { padding: theme.spacing.lgPlus, gap: theme.spacing.lg },
    /** A proposal and the sentence that argued for it are one thing to read. */
    message: { gap: theme.spacing.md },
    save: { gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    state: { padding: theme.spacing.lgPlus },
  });
