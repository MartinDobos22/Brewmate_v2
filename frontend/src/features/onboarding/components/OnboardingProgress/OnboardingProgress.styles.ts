import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OnboardingProgressStyleMap = ViewStyles<'wrapper'>;

export const createOnboardingProgressStyles = (theme: Theme): OnboardingProgressStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xs, alignSelf: 'stretch' },
  });
