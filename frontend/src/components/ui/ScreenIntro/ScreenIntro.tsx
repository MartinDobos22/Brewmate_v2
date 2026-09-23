import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createScreenIntroStyles } from './ScreenIntro.styles';
import {
  DEFAULT_SCREEN_INTRO_GROUND,
  SCREEN_INTRO_LEAD_TONES,
  SCREEN_INTRO_LEAD_VARIANTS,
  SCREEN_INTRO_NOTE_TONES,
  SCREEN_INTRO_TITLE_TONES,
  type ScreenIntroGround,
} from './screenIntroGrounds';

export interface ScreenIntroProps {
  readonly title: string;
  /** The sentence directly under the title - an instruction, not body text. */
  readonly lead?: string;
  /**
   * A quieter third line: how long this takes, what was resumed, what the
   * screen cannot promise. Read after the two above rather than with them.
   */
  readonly note?: string;
  /** Espresso where the screen opens with the block rather than with content. */
  readonly ground?: ScreenIntroGround;
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
 *
 * It takes a ground rather than being copied for the dark case, which is what
 * three screens led by an espresso block had each done separately - and one
 * of them had quietly set its subtitle as body text rather than as a lead.
 */
export const ScreenIntro = ({
  title,
  lead,
  note,
  ground = DEFAULT_SCREEN_INTRO_GROUND,
}: ScreenIntroProps): JSX.Element => {
  const styles = useThemedStyles(createScreenIntroStyles);

  return (
    <View style={styles.wrapper} accessibilityRole="header">
      <Text variant="displayTitle" tone={SCREEN_INTRO_TITLE_TONES[ground]}>
        {title}
      </Text>
      {lead === undefined ? null : (
        <Text variant={SCREEN_INTRO_LEAD_VARIANTS[ground]} tone={SCREEN_INTRO_LEAD_TONES[ground]}>
          {lead}
        </Text>
      )}
      {note === undefined ? null : (
        <Text variant="captionSmall" tone={SCREEN_INTRO_NOTE_TONES[ground]}>
          {note}
        </Text>
      )}
    </View>
  );
};
