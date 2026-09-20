import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';
import type { TileGlyph } from '../Tile';

import { createActionRowStyles } from './ActionRow.styles';
import {
  ACTION_ROW_CAPTION_TONES,
  ACTION_ROW_CHEVRON,
  ACTION_ROW_CHEVRON_COLORS,
  ACTION_ROW_ICON_COLORS,
  ACTION_ROW_TITLE_TONES,
  DEFAULT_ACTION_ROW_TONE,
  type ActionRowTone,
} from './actionRowTones';

const BADGE_STYLES = {
  espresso: 'badgeEspresso',
  surface: 'badgeSurface',
  fresh: 'badgeFresh',
} as const satisfies Record<ActionRowTone, string>;

export interface ActionRowProps {
  readonly icon: TileGlyph;
  readonly title: string;
  /** One line saying what pressing this does, where the title does not say it. */
  readonly caption?: string;
  readonly tone?: ActionRowTone;
  readonly onPress: () => void;
}

/** One way forward, with room for a sentence about it. */
export const ActionRow = ({
  icon,
  title,
  caption,
  tone = DEFAULT_ACTION_ROW_TONE,
  onPress,
}: ActionRowProps): JSX.Element => {
  const styles = useThemedStyles(createActionRowStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    styles[tone],
    pressed && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={caption === undefined ? title : `${title}. ${caption}`}
    >
      <View style={[styles.badge, styles[BADGE_STYLES[tone]]]}>
        <MaterialCommunityIcons
          name={icon}
          size={theme.size.iconMedium}
          color={theme.colors[ACTION_ROW_ICON_COLORS[tone]]}
        />
      </View>
      <View style={styles.body}>
        <Text variant="rowTitle" tone={ACTION_ROW_TITLE_TONES[tone]}>
          {title}
        </Text>
        {caption === undefined ? null : (
          <Text variant="caption" tone={ACTION_ROW_CAPTION_TONES[tone]}>
            {caption}
          </Text>
        )}
      </View>
      <MaterialCommunityIcons
        name={ACTION_ROW_CHEVRON}
        size={theme.size.iconMedium}
        color={theme.colors[ACTION_ROW_CHEVRON_COLORS[tone]]}
      />
    </Pressable>
  );
};
