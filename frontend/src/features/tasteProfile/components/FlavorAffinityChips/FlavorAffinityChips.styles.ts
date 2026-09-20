import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type FlavorAffinityChipsStyleMap = ViewStyles<'row' | 'chip' | 'liked' | 'disliked'>;

/**
 * The flavours the profile has an opinion about, as pills.
 *
 * Liked ones sit on the fresh ground and the rest on the ordinary surface,
 * which is the whole difference between them: a tag somebody dislikes is as
 * much a fact about them as one they love, so it is present and quiet rather
 * than absent or marked as wrong.
 */
export const createFlavorAffinityChipsStyles = (theme: Theme): FlavorAffinityChipsStyleMap =>
  StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      height: theme.size.flavorChipHeight,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.shape.pill,
    },
    liked: { backgroundColor: theme.colors.freshContainer },
    disliked: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
  });
