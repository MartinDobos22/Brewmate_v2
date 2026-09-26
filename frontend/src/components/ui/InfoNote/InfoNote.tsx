import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { View } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createInfoNoteStyles } from './InfoNote.styles';
import {
  DEFAULT_INFO_NOTE_TONE,
  INFO_NOTE_ICON_COLORS,
  INFO_NOTE_ICONS,
  INFO_NOTE_TEXT_TONES,
  type InfoNoteTone,
} from './infoNoteTones';

export interface InfoNoteProps {
  readonly text: string;
  readonly tone?: InfoNoteTone;
  /** Overrides the tone's own glyph where the note is about one thing in particular. */
  readonly icon?: TileGlyph;
}

/**
 * What a screen says about itself: that these are counts and not ratings, that
 * an empty shelf is normal, that a missing kettle changes the recipe.
 *
 * Always a glyph and a sentence, never a sentence on its own. An aside set in
 * the same grey as everything else around it is one nobody reads, and the mark
 * is what tells it apart from the content it is a remark about.
 *
 * The sentence is set at 13/18 rather than at a caption's 12. Twelve points
 * is the size of a second line under a row, and half of what this component
 * carries is a caveat beside a recommendation - which is a sentence somebody
 * is meant to read. It is also what the handoff sets the hint card's body at,
 * and two note components disagreeing by a point is two note components.
 */
export const InfoNote = ({
  text,
  tone = DEFAULT_INFO_NOTE_TONE,
  icon,
}: InfoNoteProps): JSX.Element => {
  const styles = useThemedStyles(createInfoNoteStyles);
  const theme = useTheme();

  return (
    <View style={[styles.base, styles[tone]]}>
      <MaterialCommunityIcons
        name={icon ?? INFO_NOTE_ICONS[tone]}
        size={theme.size.iconSmall}
        color={theme.colors[INFO_NOTE_ICON_COLORS[tone]]}
      />
      <View style={styles.body}>
        <Text variant="bodyMuted" tone={INFO_NOTE_TEXT_TONES[tone]}>
          {text}
        </Text>
      </View>
    </View>
  );
};
