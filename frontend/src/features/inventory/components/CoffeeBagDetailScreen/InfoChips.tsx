import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, Text } from '../../../../components/ui';
import { useThemedStyles } from '../../../../theme';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

const NOTHING = 0;

export interface InfoChipsProps {
  readonly label: string;
  readonly values: readonly string[];
}

/**
 * A recorded fact that is a list rather than a sentence.
 *
 * Tasting notes are the one thing on a label that arrives as several separate
 * claims, and joining them with commas turns three of the roaster's words into
 * one of ours. They are chips everywhere else the app prints them - on the
 * cupboard's card and on the taste estimate - so they are chips here, where
 * somebody reads the label properly.
 *
 * @returns null when the label said nothing. A row of commas with no words
 * between them tells somebody the app has a notes field, not that their
 * coffee has notes.
 */
export const InfoChips = ({ label, values }: InfoChipsProps): JSX.Element | null => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);

  if (values.length === NOTHING) {
    return null;
  }

  return (
    <View style={styles.chipRow}>
      <Text variant="eyebrow" tone="muted">
        {label}
      </Text>
      <View style={styles.chips}>
        {values.map((value: string): JSX.Element => (
          <Chip key={value} label={value} size="small" />
        ))}
      </View>
    </View>
  );
};
