import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';

type FeedbackSectionStyleMap = ViewStyles<'box' | 'espressoBox'>;

export const createFeedbackSectionStyles = (theme: Theme): FeedbackSectionStyleMap =>
  StyleSheet.create({
    box: {
      height: theme.size.previewBoxHeight,
      borderRadius: theme.shape.card,
      borderWidth: theme.borderWidth.thin,
      borderColor: theme.colors.outlineVariant,
      overflow: 'hidden',
    },
    /**
     * The same box on the ground brew mode and the signed-out screens use.
     *
     * Those two are dark in both colour schemes, so the state components take
     * a `ground` rather than following the scheme - and a variant that can
     * only be checked by starting a brew is one nobody checks.
     */
    espressoBox: {
      height: theme.size.previewBoxHeight,
      borderRadius: theme.shape.card,
      overflow: 'hidden',
      backgroundColor: theme.colors.espresso,
    },
  });
