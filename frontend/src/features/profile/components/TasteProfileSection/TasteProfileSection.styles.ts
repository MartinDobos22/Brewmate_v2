import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type TasteProfileSectionStyleMap = ViewStyles<'card' | 'row' | 'name' | 'divider'>;

/**
 * The two answers that are a choice rather than a position on a scale.
 *
 * Their own card, in the same row geometry as the five axes above them,
 * because they are the same kind of statement said a different way: how dark
 * somebody takes their coffee and whether they put milk in it are facts they
 * stated outright, where the axes are a weighted mean of a dozen answers.
 */
export const createTasteProfileSectionStyles = (theme: Theme): TasteProfileSectionStyleMap =>
  StyleSheet.create({
    card: {
      borderRadius: theme.shape.softCard,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lgPlus,
    },
    name: { flex: 1, minWidth: 0 },
    divider: {
      height: theme.borderWidth.thin,
      marginLeft: theme.size.axisRowDividerInset,
      backgroundColor: theme.colors.divider,
    },
  });
