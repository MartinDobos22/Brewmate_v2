import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type BagVerdictCardStyleMap = ViewStyles<
  'subject' | 'verdict' | 'section' | 'points' | 'point' | 'provenance'
>;

export const createBagVerdictCardStyles = (theme: Theme): BagVerdictCardStyleMap =>
  StyleSheet.create({
    /**
     * Which coffee this is about, separated from the answer by a rule.
     *
     * The card used to open on the opinion with no statement of what it was an
     * opinion of - which is fine in the second after a scan and useless the
     * moment somebody is holding a second bag.
     */
    subject: {
      gap: theme.spacing.xxs,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: theme.borderWidth.thin,
      borderBottomColor: theme.colors.outlineVariant,
    },
    verdict: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
    section: { gap: theme.spacing.xs, marginTop: theme.spacing.md },
    points: { gap: theme.spacing.xs },
    point: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs },
    provenance: { gap: theme.spacing.xxs, marginTop: theme.spacing.xs },
  });
