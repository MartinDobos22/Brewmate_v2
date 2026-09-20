import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type OnboardingStepLayoutStyleMap = ViewStyles<'wrapper' | 'scroll' | 'content'>;

/**
 * The frame every step sits in: the chrome at the top, the step under it.
 *
 * The chrome does not scroll. Somebody four cards into a question who decides
 * to go back should not have to scroll up to find the way - and the count is
 * the answer to "how much more of this is there", which is asked exactly when
 * the screen has been scrolled.
 */
export const createOnboardingStepLayoutStyles = (theme: Theme): OnboardingStepLayoutStyleMap =>
  StyleSheet.create({
    wrapper: { flex: 1, gap: theme.spacing.lgPlus },
    scroll: { flex: 1 },
    content: { gap: theme.spacing.md, paddingBottom: theme.spacing.xl },
  });
