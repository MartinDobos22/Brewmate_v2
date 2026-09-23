import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createScreenIntroStyles } from './ScreenIntro.styles';

export interface ScreenIntroProps {
  readonly title: string;
  /** The sentence directly under the title - an instruction, not body text. */
  readonly lead?: string;
  /**
   * A quieter third line: how long this takes, what was resumed, what the
   * screen cannot promise. Read after the two above rather than with them.
   */
  readonly note?: string;
}

/**
 * What a screen is, said once at the top of it.
 *
 * Twenty-three screens opened with the same three lines written out by hand,
 * in four different type variants, because "the title of a screen" was a
 * decision each screen made for itself. It is one decision: a screen's title
 * is the display size, the sentence under it is the lead, and anything after
 * that is a note.
 *
 * Deliberately not `SectionHeading`, which labels a group of cards from
 * inside the page. This is the page. A screen whose title is set at the same
 * size as the label over its third card is a screen with no top.
 */
export const ScreenIntro = ({ title, lead, note }: ScreenIntroProps): JSX.Element => {
  const styles = useThemedStyles(createScreenIntroStyles);

  return (
    <View style={styles.wrapper} accessibilityRole="header">
      <Text variant="displayTitle">{title}</Text>
      {lead === undefined ? null : <Text variant="bodyLead">{lead}</Text>}
      {note === undefined ? null : (
        <Text variant="captionSmall" tone="muted">
          {note}
        </Text>
      )}
    </View>
  );
};
