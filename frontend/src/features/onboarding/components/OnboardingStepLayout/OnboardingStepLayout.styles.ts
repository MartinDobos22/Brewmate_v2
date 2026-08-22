import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OnboardingStepLayoutStyleMap = ViewStyles<'wrapper' | 'header' | 'scroll' | 'content'>;

export const createOnboardingStepLayoutStyles = (theme: Theme): OnboardingStepLayoutStyleMap =>
  StyleSheet.create({
    wrapper: { flex: 1, gap: theme.spacing.md },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scroll: { flex: 1 },
    content: { gap: theme.layout.cardGap, paddingBottom: theme.spacing.xl },
  });
