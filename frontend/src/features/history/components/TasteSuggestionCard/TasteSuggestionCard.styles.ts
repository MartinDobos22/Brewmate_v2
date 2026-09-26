import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type SuggestionStyleMap = ViewStyles<
  'card' | 'heading' | 'title' | 'changes' | 'change' | 'line' | 'actions'
>;

/**
 * What the history proposes, as the one thing on this screen that wants an
 * answer.
 *
 * Drawn as the espresso card because it is the only thing here that is not a
 * count: everything below reports, this asks. On a screen of white cards a
 * fourth white card asking a question would have to be found.
 *
 * Both answers are the same size, and only their colour differs. Refusing has
 * to look like a reasonable thing to do - people buy what the shop had, drink
 * what they were given and finish a bag they did not much like - and an app
 * that made "no" the small grey option would be pressing for agreement it has
 * not earned.
 */
export const createTasteSuggestionStyles = (theme: Theme): SuggestionStyleMap =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.lg,
      padding: theme.spacing.lgPlus,
      borderRadius: theme.shape.heroCard,
      backgroundColor: theme.colors.espresso,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardHero,
    },
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    title: { flex: 1, minWidth: 0 },
    /** What would actually be written, inset so it reads as the proposal itself. */
    changes: {
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.shape.insetBlock,
      backgroundColor: theme.colors.espressoDeep,
    },
    change: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
    line: { flex: 1, minWidth: 0 },
    actions: { flexDirection: 'row', gap: theme.spacing.sm },
  });
