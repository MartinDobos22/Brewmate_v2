import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createSectionHeadingStyles } from './SectionHeading.styles';

export interface SectionHeadingProps {
  readonly title: string;
  /** One line saying what the group below is for, where that is not obvious. */
  readonly caption?: string;
}

/**
 * The label above a group of cards.
 *
 * A long screen of cards all carrying the same weight is a screen nobody can
 * scan: every card looks equally like the one being looked for. A heading says
 * which question the next few cards answer, so the reader skips three of the
 * four groups instead of reading eight titles.
 */
export const SectionHeading = ({ title, caption }: SectionHeadingProps): JSX.Element => {
  const styles = useThemedStyles(createSectionHeadingStyles);

  return (
    <View style={styles.wrapper} accessibilityRole="header">
      <Text variant="titleMedium">{title}</Text>
      {caption === undefined ? null : (
        <Text variant="bodySmall" tone="muted">
          {caption}
        </Text>
      )}
    </View>
  );
};
