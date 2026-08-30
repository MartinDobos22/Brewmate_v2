import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX, ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme, useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createTileStyles } from './Tile.styles';
import { TileRings } from './TileRings';
import {
  DEFAULT_TILE_TONE,
  TILE_BADGE_STYLES,
  TILE_ICON_COLORS,
  type TileGlyph,
  type TileTone,
} from './tileTones';

export interface TileProps {
  readonly title: string;
  /** One short line under the title. Never a sentence somebody has to read. */
  readonly caption?: string;
  readonly icon: TileGlyph;
  readonly tone?: TileTone;
  readonly onPress?: () => void;
  /** What the tile reports: a number, a miniature chart, a strip of state. */
  readonly children?: ReactNode;
  /** Sits opposite the glyph - a count, a state word, nothing at all. */
  readonly trailing?: ReactNode;
}

/**
 * One square of the home screen.
 *
 * The whole tile is the touch target rather than a button inside it, for the
 * same reason an onboarding card is: this screen is read one-handed, and a
 * tile that has to be aimed at is a tile that gets missed. A tile with no
 * `onPress` is a report and says so to a screen reader.
 *
 * Three blocks, spread apart: the glyph at the top, then what the tile is
 * called, then what it has to report. A tile with nothing to report is two
 * blocks and its title falls to the bottom, which is why the action tiles and
 * the reporting ones look like the same object rather than like two designs.
 */
export const Tile = ({
  title,
  caption,
  icon,
  tone = DEFAULT_TILE_TONE,
  onPress,
  children,
  trailing,
}: TileProps): JSX.Element => {
  const styles = useThemedStyles(createTileStyles);
  const theme = useTheme();

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.base,
    styles[tone],
    pressed && onPress !== undefined && styles.pressed,
  ];

  return (
    <Pressable
      style={resolveStyle}
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? 'summary' : 'button'}
      accessibilityLabel={caption === undefined ? title : `${title}. ${caption}`}
    >
      <TileRings tone={tone} />
      <View style={styles.header}>
        <View style={[styles.badge, styles[TILE_BADGE_STYLES[tone]]]}>
          <MaterialCommunityIcons
            name={icon}
            size={theme.size.iconMedium}
            color={theme.colors[TILE_ICON_COLORS[tone]]}
          />
        </View>
        {trailing}
      </View>
      <View style={styles.heading}>
        <Text variant="titleSmall">{title}</Text>
        {caption === undefined ? null : (
          <Text variant="labelSmall" tone="muted">
            {caption}
          </Text>
        )}
      </View>
      {children === undefined ? null : <View style={styles.body}>{children}</View>}
    </Pressable>
  );
};
