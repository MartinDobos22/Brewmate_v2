import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagVerdictCardStyleMap = ViewStyles<
  'card' | 'subject' | 'badge' | 'subjectBody' | 'roaster' | 'verdict' | 'provenance' | 'line'
>;

/**
 * The answer, on the one card this whole feature exists for.
 *
 * Espresso, because the verdict is the single most important thing on the
 * screen and this design says that by weight rather than by colour - and the
 * colour is deliberately the same whatever the verdict says. A card that went
 * green for a good coffee and red for a bad one would be grading it, and
 * nobody has measured anybody's taste.
 *
 * The provenance sits under a rule rather than in the sentence: when the
 * verdict was given and how much the app knew about this person are facts
 * about the advice, not part of it.
 */
export const createBagVerdictCardStyles = (theme: Theme): BagVerdictCardStyleMap =>
  StyleSheet.create({
    card: {
      gap: theme.spacing.lg,
      padding: theme.spacing.xl,
      borderRadius: theme.shape.heroCard,
      backgroundColor: theme.colors.espresso,
      overflow: 'hidden',
      shadowColor: theme.colors.espresso,
      ...theme.elevation.cardHero,
    },
    subject: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
    badge: {
      width: theme.size.headerButtonSize,
      height: theme.size.headerButtonSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoDeep,
    },
    subjectBody: { flex: 1, minWidth: 0, gap: theme.spacing.xxs },
    roaster: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    verdict: { gap: theme.spacing.sm },
    provenance: {
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      borderTopWidth: theme.borderWidth.thin,
      borderTopColor: theme.colors.espressoLine,
    },
    line: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  });
