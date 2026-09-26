import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type CalibrationChatStyleMap = ViewStyles<'wrapper' | 'readings' | 'chips'>;

/**
 * "Rozumiem tomu takto", drawn with the two pieces the app already has for
 * it: the drinker's own sentence in their own bubble, and what was read out
 * of it as a row of fact chips.
 *
 * The readings were a column of ordinary sentences, which is how the app
 * prints its own opinions - and these are not opinions, they are what one
 * sentence was parsed into. A pill states a fact and offers nothing to press,
 * which is exactly the claim being made, and a row of them can be checked
 * against the bubble above in one glance rather than read line by line.
 */
export const createCalibrationChatStyles = (theme: Theme): CalibrationChatStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.md, alignSelf: 'stretch' },
    readings: { gap: theme.spacing.sm },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  });
