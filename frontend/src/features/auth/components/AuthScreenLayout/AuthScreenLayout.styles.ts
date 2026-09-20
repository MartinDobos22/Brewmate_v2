import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type AuthScreenLayoutStyleMap = ViewStyles<'root' | 'ground' | 'content' | 'header' | 'body'>;

/**
 * The signed-out screens: brown from edge to edge, with the mark hanging off
 * the top and the form centred in what is left.
 *
 * Centred rather than starting at the top, because there is nothing above the
 * form and nothing below it - no navigation, no tabs, no history. A form
 * pinned to the top of an otherwise empty screen reads as the first of several
 * things, and there is only ever this one.
 *
 * It still scrolls. On a small phone with the keyboard open the centred column
 * is taller than what is left of the screen, and a form that cannot be
 * scrolled to is a form nobody can finish.
 *
 * The ground clips its own contents, which is what makes the ring set hanging
 * off the top edge a mark rather than three arcs drawn over the status bar.
 */
export const createAuthScreenLayoutStyles = (theme: Theme): AuthScreenLayoutStyleMap =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.espresso },
    ground: { flex: 1, overflow: 'hidden' },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      gap: theme.spacing.xl,
      padding: theme.spacing.lgPlus,
    },
    header: { gap: theme.spacing.xs },
    body: { gap: theme.spacing.xl },
  });
