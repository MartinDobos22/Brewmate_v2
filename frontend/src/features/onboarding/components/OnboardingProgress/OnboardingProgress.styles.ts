import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OnboardingProgressStyleMap = ViewStyles<'wrapper' | 'heading' | 'name'>;

export const createOnboardingProgressStyles = (theme: Theme): OnboardingProgressStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm, alignSelf: 'stretch' },
    /** Where you are on the left, how much is left of it on the right. */
    heading: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    name: { flex: 1, minWidth: 0 },
  });
