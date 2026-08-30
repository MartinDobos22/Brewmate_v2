import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type SectionHeadingStyleMap = ViewStyles<'wrapper'>;

/**
 * A heading is not a card.
 *
 * It has no surface of its own and no border, because the moment it gets one
 * it competes with the cards it is supposed to be labelling - and a screen
 * where the labels look like the content is a screen with no grouping at all.
 * The top padding is what separates one group from the previous group's last
 * card; the bottom gap comes from the screen.
 */
export const createSectionHeadingStyles = (theme: Theme): SectionHeadingStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.xxs, paddingTop: theme.spacing.lg },
  });
