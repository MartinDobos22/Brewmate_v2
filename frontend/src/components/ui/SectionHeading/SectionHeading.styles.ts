import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme } from '../../../theme';

import {
  SECTION_HEADING_TOP_SPACE,
  type SectionHeadingPlacement,
} from './sectionHeadingPlacements';

/**
 * A heading is not a card.
 *
 * It has no surface of its own and no border, because the moment it gets one
 * it competes with the cards it is supposed to be labelling - and a screen
 * where the labels look like the content is a screen with no grouping at all.
 * The top padding is what separates one group from the previous group's last
 * card; the bottom gap comes from the screen.
 */
export const sectionHeadingWrapper = (
  theme: Theme,
  placement: SectionHeadingPlacement,
): ViewStyle => ({
  gap: theme.spacing.xxs,
  paddingTop: theme.spacing[SECTION_HEADING_TOP_SPACE[placement]],
});

/** The mark before the title, where a group has one. */
export const createSectionHeadingStyles = (theme: Theme): { readonly row: ViewStyle } =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  });
