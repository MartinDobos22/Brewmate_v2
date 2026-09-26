import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type VerdictReasonsStyleMap = ViewStyles<
  'card' | 'group' | 'groupLabel' | 'lines' | 'line' | 'lineBody' | 'divider'
>;

/**
 * The argument, always open.
 *
 * It used to sit behind a disclosure button on the argument that in a shop the
 * sentence is wanted first. That was right about the order and wrong about the
 * tap: somebody who disagrees with a verdict wants to know why *now*, and a
 * button between them and the reasons is one more thing to do while holding a
 * bag. The verdict is still above it, so the order is unchanged.
 */
export const createVerdictReasonsStyles = (theme: Theme): VerdictReasonsStyleMap =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lgPlus,
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    group: { gap: theme.spacing.lg },
    groupLabel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    lines: { gap: theme.spacing.md },
    line: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
    lineBody: { flex: 1, minWidth: 0 },
    divider: { height: theme.borderWidth.thin, backgroundColor: theme.colors.divider },
  });
