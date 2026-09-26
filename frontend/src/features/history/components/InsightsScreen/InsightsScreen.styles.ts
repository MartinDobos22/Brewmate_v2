import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type InsightsScreenStyleMap = ViewStyles<'intro' | 'denominator' | 'stack'>;

/**
 * The one question this screen is allowed to ask, then the numbers it was
 * drawn from.
 *
 * The suggestion sits above the counts because it is the only thing here that
 * wants an answer - and the counts sit under it so somebody who wants to
 * disagree can see exactly what they are disagreeing with.
 */
export const createInsightsScreenStyles = (theme: Theme): InsightsScreenStyleMap =>
  StyleSheet.create({
    intro: { gap: theme.spacing.sm },
    /** How many cups this was counted from, beside its own glyph. */
    denominator: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    stack: { gap: theme.spacing.lgPlus },
  });
