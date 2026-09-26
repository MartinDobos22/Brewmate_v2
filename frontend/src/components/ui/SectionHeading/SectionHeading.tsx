import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createSectionHeadingStyles, sectionHeadingWrapper } from './SectionHeading.styles';
import {
  DEFAULT_SECTION_HEADING_PLACEMENT,
  type SectionHeadingPlacement,
} from './sectionHeadingPlacements';

export interface SectionHeadingProps {
  readonly title: string;
  /** One line saying what the group below is for, where that is not obvious. */
  readonly caption?: string;
  /** A mark before the title, where the group has one the reader recognises. */
  readonly icon?: TileGlyph;
  /** `card` drops the top padding a group label carries on a screen. */
  readonly placement?: SectionHeadingPlacement;
}

/**
 * The label above a group of cards, or the title inside one.
 *
 * A long screen of cards all carrying the same weight is a screen nobody can
 * scan: every card looks equally like the one being looked for. A heading says
 * which question the next few cards answer, so the reader skips three of the
 * four groups instead of reading eight titles. Inside a card it does the same
 * job one level down, and keeps the title and its line together rather than
 * letting the card's own gap push them apart.
 */
export const SectionHeading = ({
  title,
  caption,
  icon,
  placement = DEFAULT_SECTION_HEADING_PLACEMENT,
}: SectionHeadingProps): JSX.Element => {
  const styles = useThemedStyles(createSectionHeadingStyles);
  const theme = useTheme();

  return (
    <View style={sectionHeadingWrapper(theme, placement)} accessibilityRole="header">
      <View style={styles.row}>
        {icon === undefined ? null : (
          <MaterialCommunityIcons
            name={icon}
            size={theme.size.iconSmall}
            color={theme.colors.onSurfaceVariant}
          />
        )}
        <Text variant="sectionHeading">{title}</Text>
      </View>
      {caption === undefined ? null : (
        <Text variant="bodyMuted" tone="muted">
          {caption}
        </Text>
      )}
    </View>
  );
};
